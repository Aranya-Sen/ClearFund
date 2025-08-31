# MetaMask Circuit Breaker Error - Troubleshooting Guide

## What is the Circuit Breaker Error?

The "circuit breaker is open" error occurs when MetaMask detects too many failed requests or network issues. This is a safety mechanism to prevent excessive API calls.

## Error Message
```
could not coalesce error (error={ "code": -32603, "data": { "cause": { "isBrokenCircuitError": true, "message": "Execution prevented because the circuit breaker is open"
```

## Solutions (Try in Order)

### 1. **Refresh the Page**
- Simply refresh your browser page (F5 or Ctrl+R)
- This often resolves temporary connection issues

### 2. **Restart MetaMask**
- Close your browser completely
- Restart your browser
- Unlock MetaMask and try again

### 3. **Check Network Connection**
- Ensure you're connected to the **Sepolia Testnet**
- In MetaMask, click the network dropdown
- Select "Sepolia" or add it if not available

### 4. **Switch Networks**
- In MetaMask, switch to a different network (like Mainnet)
- Wait a few seconds
- Switch back to Sepolia

### 5. **Clear Browser Cache**
- Clear your browser cache and cookies
- Restart the browser
- Try again

### 6. **Reset MetaMask**
- In MetaMask, go to Settings > Advanced
- Scroll down and click "Reset Account"
- This will clear transaction history but keep your accounts

### 7. **Use Different Browser**
- Try using a different browser (Chrome, Firefox, Edge)
- Install MetaMask in the new browser
- Import your wallet

### 8. **Check Internet Connection**
- Ensure you have a stable internet connection
- Try disconnecting and reconnecting to your network

## Prevention Tips

1. **Don't spam transactions** - Wait for each transaction to complete
2. **Use stable internet** - Avoid switching networks frequently
3. **Keep MetaMask updated** - Use the latest version
4. **Don't open multiple tabs** - Close unused MetaMask tabs

## Technical Details

The circuit breaker error (code -32603) is triggered when:
- Too many failed RPC requests
- Network connectivity issues
- MetaMask internal state problems
- Browser extension conflicts

## Still Having Issues?

If none of the above solutions work:

1. **Contact Support** - Reach out to our support team
2. **Check MetaMask Status** - Visit [MetaMask Status Page](https://status.metamask.io/)
3. **Community Help** - Ask in our community forums

## Quick Fix Button

Our application includes a "Fix Connection" button that will:
- Reset the MetaMask connection
- Retry the operation with exponential backoff
- Provide helpful error messages

Click the "Fix Connection" button when you see blockchain errors in the create campaign form.

---

**Note**: This error is temporary and usually resolves quickly. It's a safety feature, not a permanent issue with your wallet or our application.
