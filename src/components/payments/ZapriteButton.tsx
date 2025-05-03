export const ZapriteButton = () => {
  const handleSupport = async () => {
    // TODO: Implement Zaprite payment flow
    try {
      // 1. Get contact info from Zaprite API
      // 2. Generate payment request
      // 3. Show QR code or redirect to payment page
      console.log('Support button clicked');
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <button
      onClick={handleSupport}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
    >
      Support with Bitcoin ⚡
    </button>
  );
};