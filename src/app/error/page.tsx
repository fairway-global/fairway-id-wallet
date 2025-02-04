// import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

// export default function ErrorPage() {
//   return (
//     // <div classNameName="flex items-center justify-center bg-gray-100">
//     //   <div classNameName="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
//     //     {/* Icon */}
//     //     <div classNameName="flex flex-col item justify-center w-full">
//     //       <ExclamationTriangleIcon
//     //         height={40}
//     //         width={40}
//     //         classNameName="text-red-500"
//     //       />
//     //     </div>

//     //     {/* Heading */}
//     //     <h1 classNameName="mt-4 text-2xl font-bold text-gray-800">
//     //       Device Not Supported
//     //     </h1>

//     //     {/* Message */}
//     //     <p classNameName="mt-2 text-gray-600">
//     //       Sorry, this page is only accessible on mobile devices. Please visit us
//     //       from a smartphone or tablet.
//     //     </p>

//     //     {/* Optional: Back to Home Button */}
//     //     <div classNameName="mt-6">
//     //       <a
//     //         href="/"
//     //         classNameName="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
//     //       >
//     //         Go Back Home
//     //       </a>
//     //     </div>
//     //   </div>
//     // </div>
//     <section className="bg-white dark:bg-gray-900">
//       <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
//         <div className="mx-auto max-w-screen-sm text-center">
//           <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
//             404
//           </h1>
//           <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
//             Something's missing.
//           </p>
//           <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
//             Sorry, we can't find that page. You'll find lots to explore on the
//             home page.{" "}
//           </p>
//           <a
//             href="#"
//             className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
//           >
//             Back to Homepage
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

const page = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <button className="mt-5">
        <span className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

          <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
            <Link href="/">Go Home</Link>
          </span>
        </span>
      </button>
    </div>
  );
};

export default page;
