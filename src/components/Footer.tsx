const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-8 px-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
