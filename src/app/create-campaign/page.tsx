'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  FlagIcon,
  PhotoIcon,
  ShieldCheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useApi } from '../../hooks/useApi';
import MetaMaskErrorHandler from '../../components/MetaMaskErrorHandler';

const steps = [
  { id: 1, name: 'Campaign Details', icon: DocumentTextIcon },
  { id: 2, name: 'Images & Media', icon: PhotoIcon },
  { id: 3, name: 'Milestones', icon: FlagIcon },
  { id: 4, name: 'Review & Submit', icon: CheckCircleIcon }
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [blockchainCampaignId, setBlockchainCampaignId] = useState<number | null>(null);
  
  const { 
    isConnected, 
    account, 
    connectWallet, 
    createCampaign, 
    isLoading: blockchainLoading,
    error: blockchainError
  } = useBlockchain();

  const [showErrorHandler, setShowErrorHandler] = useState(false);

  const { callApi, loading: apiLoading, error: apiError } = useApi();

  // File refs
  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    goalAmount: '',
    currency: 'ETH',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    tags: '',
    country: '',
    city: '',
    address: '',
    milestones: [
      { title: '', description: '', targetAmount: '', dueDate: '' }
    ]
  });

  const [images, setImages] = useState<{
    mainImage: File | null;
    additionalImages: File[];
  }>({
    mainImage: null,
    additionalImages: []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', targetAmount: '', dueDate: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length > 1) {
      const newMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, milestones: newMilestones }));
    }
  };

  const handleImageChange = (type: 'main' | 'additional', files: FileList | null) => {
    if (!files) return;

    if (type === 'main') {
      setImages(prev => ({ ...prev, mainImage: files[0] }));
    } else {
      const newFiles = Array.from(files);
      setImages(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, ...newFiles] 
      }));
    }
  };

  const removeImage = (type: 'main' | 'additional', index?: number) => {
    if (type === 'main') {
      setImages(prev => ({ ...prev, mainImage: null }));
      if (mainImageRef.current) mainImageRef.current.value = '';
    } else if (index !== undefined) {
      setImages(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index)
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.shortDescription && 
                 formData.category && formData.goalAmount && formData.endDate);
      case 2:
        return true; // Images are optional
      case 3:
        return formData.milestones.every(m => m.title && m.description && m.targetAmount);
      default:
        return true;
    }
  };

  const handleSubmitCampaign = async () => {
    if (!isConnected || !account) {
      alert('Please connect your wallet first');
      await connectWallet();
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate duration in days from end date
      const endDate = new Date(formData.endDate);
      const startDate = new Date(formData.startDate);
      const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      
      // Prepare milestone data for blockchain
      const milestoneDescriptions = formData.milestones.map(m => `${m.title}: ${m.description}`);
      const milestoneAmounts = formData.milestones.map(m => m.targetAmount);
      
      console.log('Creating campaign on blockchain...');
      
      // Create campaign on blockchain first
      const receipt = await createCampaign(
        formData.goalAmount,
        durationInDays,
        milestoneDescriptions,
        milestoneAmounts
      );
      
      console.log('Blockchain transaction receipt:', receipt);
      
      // Get campaign ID from the receipt (added by our enhanced createCampaign function)
      const blockchainId = (receipt as unknown as { campaignId?: number }).campaignId || Date.now();
      
      setBlockchainCampaignId(blockchainId);
            setTransactionHash((receipt as unknown as { transactionHash?: string }).transactionHash || '');

      console.log('Campaign created on blockchain, ID:', blockchainId);
      
      // Now create campaign in MongoDB with blockchain data
      const formDataToSend = new FormData();
      
      // Basic campaign data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('goalAmount', formData.goalAmount);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('creatorWalletAddress', account);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('address', formData.address);
      
      // Blockchain data
      formDataToSend.append('blockchainCampaignId', blockchainId.toString());
      formDataToSend.append('transactionHash', (receipt as unknown as { transactionHash?: string }).transactionHash || '');
      
      // Milestones data
      formDataToSend.append('milestones', JSON.stringify(formData.milestones.map(m => ({
        title: m.title,
        description: m.description,
        targetAmount: parseFloat(m.targetAmount),
        dueDate: m.dueDate
      }))));

      // Images
      if (images.mainImage) {
        formDataToSend.append('mainImage', images.mainImage);
      }
      
      images.additionalImages.forEach((image) => {
        formDataToSend.append('additionalImages', image);
      });

      console.log('Creating campaign in MongoDB...');
      
            // Create campaign in MongoDB
      const response = await callApi('/api/campaigns', {
        method: 'POST',
        body: formDataToSend
      });

      console.log('API Response:', response);

      // Check if response has campaign data (success case)
      if (response && response.campaign && response.message === 'Campaign created successfully') {
        setCampaignId(response.campaign._id);
        console.log('Campaign created successfully in MongoDB:', response.campaign);
      
      // Move to success state
        setCurrentStep(5);
      } else {
        console.error('Unexpected API response:', response);
        throw new Error(response?.error || 'Failed to create campaign in database');
      }
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(error instanceof Error ? error.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Campaign Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                placeholder="Enter your campaign title"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Short Description *
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Brief description of your campaign (max 200 characters)"
                rows={3}
                maxLength={200}
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.shortDescription.length}/200 characters
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Full Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Detailed description of your campaign"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Arts">Arts</option>
                <option value="Community">Community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Funding Goal (ETH) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">ETH</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                    placeholder="10.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                >
                  <option value="ETH">ETH</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                  Start Date *
              </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                  End Date *
              </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
              />
            </div>
          </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                Tags (comma-separated)
                </label>
                <input
                  type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                placeholder="technology, blockchain, innovation"
                />
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                  placeholder="United States"
                />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                  City
              </label>
              <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                  placeholder="New York"
              />
            </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                  Address
                  </label>
                  <input
                    type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
                  placeholder="123 Main St"
                  />
                </div>
                </div>
              </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                Main Campaign Image
                </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                {images.mainImage ? (
                  <div className="space-y-4">
                    <img
                      src={URL.createObjectURL(images.mainImage)}
                      alt="Main campaign image"
                      className="mx-auto max-h-64 rounded-lg"
                    />
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => removeImage('main')}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Remove
                      </button>
              </div>
              </div>
                ) : (
                <div>
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button
                        onClick={() => mainImageRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Choose Image
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Recommended: 1200x800 pixels, max 5MB
                    </p>
                  </div>
                )}
                  <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('main', e.target.files)}
                  className="hidden"
                />
              </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                Additional Images
                  </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                {images.additionalImages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.additionalImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage('additional', index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                </div>
                      ))}
                    </div>
                    <button
                      onClick={() => additionalImagesRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add More Images
                    </button>
                  </div>
                ) : (
                <div>
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <button
                        onClick={() => additionalImagesRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Choose Images
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      You can add multiple images to showcase your project
                    </p>
                  </div>
                )}
                  <input
                  ref={additionalImagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange('additional', e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Campaign Milestones</h3>
              <button
                onClick={addMilestone}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Milestone
              </button>
            </div>

            {formData.milestones.map((milestone, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Milestone {index + 1}</h4>
                  {formData.milestones.length > 1 && (
                    <button
                      onClick={() => removeMilestone(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Product Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount (ETH) *
                    </label>
                      <input
                        type="number"
                      step="0.01"
                      value={milestone.targetAmount}
                      onChange={(e) => handleMilestoneChange(index, 'targetAmount', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5.0"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Describe what will be accomplished in this milestone"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Campaign Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Category:</span> {formData.category}</p>
                    <p><span className="font-medium">Goal:</span> {formData.goalAmount} {formData.currency}</p>
                    <p><span className="font-medium">Duration:</span> {formData.startDate} to {formData.endDate}</p>
                </div>
                  </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Country:</span> {formData.country || 'Not specified'}</p>
                    <p><span className="font-medium">City:</span> {formData.city || 'Not specified'}</p>
                    <p><span className="font-medium">Address:</span> {formData.address || 'Not specified'}</p>
                </div>
              </div>
            </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700">{formData.description}</p>
                </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Milestones ({formData.milestones.length})</h4>
                <div className="space-y-2">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="text-sm">
                      <p><span className="font-medium">{milestone.title}</span> - {milestone.targetAmount} ETH</p>
                      <p className="text-gray-600">{milestone.description}</p>
                </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Media</h4>
                <div className="text-sm">
                  <p><span className="font-medium">Main Image:</span> {images.mainImage ? 'Uploaded' : 'Not uploaded'}</p>
                  <p><span className="font-medium">Additional Images:</span> {images.additionalImages.length} uploaded</p>
                </div>
              </div>
            </div>

            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                    <h4 className="font-medium text-yellow-900">Wallet Connection Required</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please connect your wallet to create a campaign on the blockchain.
                    </p>
                </div>
                </div>
                </div>
            )}

            {blockchainError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                <div>
                      <h4 className="font-medium text-red-900">Blockchain Error</h4>
                      <p className="text-sm text-red-700 mt-1">{blockchainError}</p>
                </div>
              </div>
                  <button
                    onClick={() => setShowErrorHandler(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Fix Connection
                  </button>
            </div>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                    <h4 className="font-medium text-red-900">API Error</h4>
                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                      </div>
                      </div>
                    </div>
            )}
                  </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your campaign has been created on the blockchain and stored in our database.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Campaign ID:</span>
                  <p className="text-gray-900">{campaignId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Blockchain ID:</span>
                  <p className="text-gray-900">{blockchainCampaignId}</p>
                  </div>
                <div>
                  <span className="font-medium text-gray-700">Transaction Hash:</span>
                  <p className="text-gray-900 font-mono text-xs break-all">{transactionHash}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Link 
                href="/campaigns"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View All Campaigns
              </Link>
              <Link 
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full mx-4">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-blue-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-8">
              You need to connect your wallet to create a campaign on the blockchain.
            </p>
                  <button
                    onClick={connectWallet}
                    disabled={blockchainLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {blockchainLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
            <Link
              href="/campaigns"
              className="block mt-4 text-blue-600 hover:text-blue-700"
            >
              ← Back to Campaigns
            </Link>
                </div>
              </div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">
            Create a new crowdfunding campaign on the blockchain
          </p>
              </div>

        {/* Progress Steps - Only show if not on success step */}
        {currentStep !== 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircleIcon className="h-7 w-7" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`ml-3 text-base font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-6 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-10">
          {renderStepContent()}

          {/* Navigation Buttons - Only show if not on success step */}
          {currentStep !== 5 && (
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center px-8 py-4 rounded-xl font-medium transition-colors ${
                  currentStep === 1 || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-3" />
                Previous
              </button>

              <div className="text-base text-gray-500">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRightIcon className="h-5 w-5 ml-3" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitCampaign}
                  disabled={isSubmitting || !isConnected}
                  className="flex items-center px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-3" />
                      Submit Campaign
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MetaMask Error Handler */}
      <MetaMaskErrorHandler 
        error={blockchainError} 
        onClose={() => setShowErrorHandler(false)}
      />
    </div>
  );
}