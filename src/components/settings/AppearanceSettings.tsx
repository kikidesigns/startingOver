import { useState, useEffect } from 'react';
import { updateUserTheme } from '../../lib/db';

interface Theme {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  backgroundImage?: string;
}

export const AppearanceSettings = () => {
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    linkColor: '#3b82f6'
  });
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      // Load theme from DB
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';

      let imageUrl = theme.backgroundImage;
      if (backgroundImage) {
        // TODO: Implement image upload to local storage or cloud service
        // imageUrl = await uploadImage(backgroundImage);
      }

      await updateUserTheme(userId, {
        ...theme,
        backgroundImage: imageUrl
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Appearance Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Customize Your POD</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
              className="w-full h-10 p-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
              className="w-full h-10 p-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Color
            </label>
            <input
              type="color"
              value={theme.linkColor}
              onChange={(e) => setTheme({ ...theme, linkColor: e.target.value })}
              className="w-full h-10 p-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Background preview"
                className="mt-2 max-w-full h-40 object-cover rounded"
              />
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-4">Preview</h3>
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <h4 className="text-xl font-bold mb-4">Sample POD Content</h4>
            <p className="mb-4">This is how your POD content will look.</p>
            <a
              href="#"
              style={{ color: theme.linkColor }}
              className="underline"
            >
              Sample Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};