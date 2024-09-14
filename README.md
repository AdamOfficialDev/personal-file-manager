# Personal File Manager 📂

Personal File Manager is a React-based web application that allows users to manage files and folders within Firebase Storage. This project includes features for file uploads, folder management, and previewing files. The app uses Firebase for backend storage and TailwindCSS for UI styling.

## Features 🚀

- **File Upload** 📤: Upload multiple files to Firebase Storage.
- **Folder Management** 🗂️: Create folders and navigate through the file structure.
- **File Preview** 👀: Preview image and text files directly within the app.
- **File Download** ⬇️: Download files from Firebase Storage.
- **Responsive Design** 📱💻: Fully responsive UI, adapting to mobile and desktop views.

## Tech Stack 🛠️

- **Vite React** ⚛️: Frontend framework for building the user interface.
- **React Router** 🚦: For navigation and routing between pages.
- **Firebase** 🔥: Backend storage for managing file uploads and folder structures.
- **TailwindCSS** 🎨: Utility-first CSS framework for styling the application.
- **DaisyUI** 🌼: For enhancing the UI components and layouts.

## Installation 💻

To set up and run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/AdamOfficialDev/personal-file-manager.git
   cd personal-file-manager
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase:

   - Update your Firebase configuration in `src/firebaseConfig.js` with your own Firebase credentials.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to:

   ```
   http://localhost:3000
   ```

## Folder Structure 🗃️

- **/public**: Contains static assets.
- **/src**:
  - **/components**: React components such as `FileManager`, `FileUpload`, and `FileList` for managing files and folders.
  - **/pages**: Includes the main pages like `Home` and `StorageInfo`.
  - **/assets**: Contains assets like icons.
  - **/firebaseConfig.js**: Firebase configuration file.
  - **/App.jsx**: Main entry point for the app's routing.

## Firebase Configuration 🔧

In `src/firebaseConfig.js`, ensure that you replace the Firebase credentials with your own project details:

```js
const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket>",
  messagingSenderId: "<your-messaging-sender-id>",
  appId: "<your-app-id>",
};
```

## Available Scripts 📜

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Lints the code using ESLint.

## License 📜

This project is open-source and available under the MIT License.
