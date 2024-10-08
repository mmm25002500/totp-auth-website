import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang="en">
      <Head />
      <body className='h-full text-black bg-white dark:bg-gray-blue-900 dark:text-white transition duration-300 ease-in-out'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document;