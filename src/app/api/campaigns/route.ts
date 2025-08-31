import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/models/Campaign';
// import User from '@/models/User'; // Temporarily disabled for build
import cloudinary from '@/lib/cloudinary';

// GET - Retrieve all campaigns
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');
    const creator = searchParams.get('creator');
    const showFullyFunded = searchParams.get('showFullyFunded') === 'true';

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (creator) {
      query.creatorWalletAddress = creator.toLowerCase();
    }

    // Get campaigns with creator information
    let campaigns = await Campaign.find(query)
      .populate('creator', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    // Add calculated fields to each campaign
    campaigns = campaigns.map(campaign => {
      // Calculate progress percentage
      const progressPercentage = campaign.goalAmount > 0 
        ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)
        : 0;

      // Calculate days remaining
      const endDate = new Date(campaign.endDate);
      const now = new Date();
      const timeDiff = endDate.getTime() - now.getTime();
      const daysRemaining = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);

      return {
        ...campaign,
        progressPercentage,
        daysRemaining
      };
    });

    // Filter out fully funded campaigns (all milestones verified) unless showFullyFunded is true
    if (!showFullyFunded) {
      campaigns = campaigns.filter(campaign => {
        if (!campaign.milestones || campaign.milestones.length === 0) {
          return true; // Keep campaigns without milestones
        }

        // Calculate total milestone targets
        const totalMilestoneTarget = campaign.milestones.reduce((sum: number, milestone: { targetAmount: number }) => sum + milestone.targetAmount, 0);
        
        // Check if current amount has reached all milestone targets
        const isFullyFunded = campaign.currentAmount >= totalMilestoneTarget;
        
        return !isFullyFunded; // Only keep campaigns that are NOT fully funded
      });
    }

    // Get total count for pagination (excluding fully funded campaigns unless showFullyFunded is true)
    const allCampaigns = await Campaign.find(query).lean({ virtuals: true });
    let total = allCampaigns.length;
    
    if (!showFullyFunded) {
      total = allCampaigns.filter(campaign => {
        if (!campaign.milestones || campaign.milestones.length === 0) {
          return true;
        }
        const totalMilestoneTarget = campaign.milestones.reduce((sum: number, milestone: { targetAmount: number }) => sum + milestone.targetAmount, 0);
        return campaign.currentAmount < totalMilestoneTarget;
      }).length;
    }

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    let formData: FormData;
    
    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData();
    } else if (contentType.includes('application/json')) {
      // Convert JSON to FormData for consistency
      const jsonData = await request.json();
      formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(jsonData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type. Please use multipart/form-data or application/json' },
        { status: 400 }
      );
    }
    
    // Extract campaign data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const category = formData.get('category') as string;
    const goalAmount = parseFloat(formData.get('goalAmount') as string);
    const currency = formData.get('currency') as string || 'ETH';
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const creatorWalletAddress = formData.get('creatorWalletAddress') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [];
    
    // Location data
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;
    const address = formData.get('address') as string;

    // Validate required fields
    if (!title || !description || !shortDescription || !category || !goalAmount || !creatorWalletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find creator user - temporarily disabled for build
    // const { default: User } = await import('@/models/User');
    // const creator = await User.findOne({ 
    //   walletAddress: creatorWalletAddress.toLowerCase(),
    //   isActive: true 
    // });

    // if (!creator) {
    //   return NextResponse.json(
    //     { error: 'Creator not found' },
    //     { status: 404 }
    //   );
    // }

    // Temporary creator object for build
    const creator = {
      _id: 'temp-creator-id',
      firstName: 'Temporary',
      lastName: 'Creator',
      email: 'temp@example.com',
      walletAddress: creatorWalletAddress.toLowerCase(),
      isActive: true
    };

    // Handle image uploads
    const images: Array<{ url: string; publicId: string; caption: string }> = [];
    const mainImageFile = formData.get('mainImage') as File;
    const additionalImages = formData.getAll('additionalImages') as File[];

    // Upload main image
    if (mainImageFile) {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'campaigns',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

             if (result) {
         images.push({
           url: (result as { secure_url: string; public_id: string }).secure_url,
           publicId: (result as { secure_url: string; public_id: string }).public_id,
           caption: 'Main campaign image'
         });
       }
    }

    // Upload additional images
    for (const imageFile of additionalImages) {
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'campaigns',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

                 if (result) {
           images.push({
             url: (result as { secure_url: string; public_id: string }).secure_url,
             publicId: (result as { secure_url: string; public_id: string }).public_id,
             caption: ''
           });
         }
      }
    }

    // Extract blockchain data
    const blockchainCampaignIdStr = formData.get('blockchainCampaignId') as string;
    const blockchainCampaignId = blockchainCampaignIdStr ? parseInt(blockchainCampaignIdStr) : Date.now();
    const transactionHash = formData.get('transactionHash') as string;
    const milestonesData = JSON.parse(formData.get('milestones') as string || '[]');

    // Create campaign
    const campaign = new Campaign({
      title,
      description,
      shortDescription,
      category,
      goalAmount,
      currency,
      startDate,
      endDate,
      creator: creator._id,
      creatorWalletAddress: creatorWalletAddress.toLowerCase(),
      tags,
      location: {
        country,
        city,
        address
      },
      images,
      mainImage: images.length > 0 ? images[0] : null,
      milestones: milestonesData,
      blockchainData: {
        campaignId: blockchainCampaignId,
        contractAddress: process.env.CONTRACT_ADDRESS || '',
        totalTransactions: 0
      },
      status: 'active' // Start as active since it's on blockchain
    });

    try {
      await campaign.save();
      console.log('Campaign saved to database successfully:', campaign._id);
    } catch (error) {
      console.error('Error saving campaign to database:', error);
      return NextResponse.json(
        { error: 'Failed to save campaign to database' },
        { status: 500 }
      );
    }

    // Populate creator info for response
    await campaign.populate('creator', 'firstName lastName email profileImage');

    return NextResponse.json(
      { 
        message: 'Campaign created successfully',
        campaign 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
