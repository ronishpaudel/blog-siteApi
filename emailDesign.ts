export const emailBody = ({
  link,
  username,
  Otp,
}: {
  link: string;
  username: string;
  Otp: number;
}) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Confirmation</title>
    <!-- Include the Tailwind CSS stylesheet -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <div class="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Account Confirmation,${Otp}.</h1>
    <div class="text-gray-600 dark:text-gray-400 text-lg mb-6">
    <div class="text-[16px]text-semibold">Hello ${username},</>
      Thank you for signing up with techEra.io. To activate your account and get started, please click the button below.
    </div>
    <a href="${link}" class="inline-block w-full max-w-xs mx-auto bg-blue-600 px-6 py-3 text-lg font-medium text-gray-50 rounded-md shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-300 dark:text-gray-900 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-200">
      Activate Account
    </a>

  </div>
  
  </body>
  </html>
`;
};
