// // Universal product type for all items
// export interface Product {
//     id: string;
//     name: string;
//     price: number;
//     image: string;
//     soldOut: boolean;
//     category: 'outfit' | 'shoe' | 'accessory';
//     // Additional details (shown on product page)
//     details: {
//         sizes: string;
//         gender?: 'Male' | 'Female';
//         description?: string;
//     };
// }

// // All products data array
// export const productsData: Product[] = [
//     // Outfits
//     {
//         id: "outfit-1",
//         name: "NIYA",
//         price: 12000,
//         image: "/black-dress.jpg",
//         soldOut: false,
//         category: "outfit",
//         details: {
//             sizes: "10-16",
//         }
//     },
//     {
//         id: "outfit-2",
//         name: "MAHFA",
//         price: 18000,
//         image: "/pink-dress.jpg",
//         soldOut: false,
//         category: "outfit",
//         details: {
//             sizes: "10-16",
//         }
//     },
//     {
//         id: "outfit-3",
//         name: "ADIA BUBU",
//         price: 7000,
//         image: "/white-dress.jpg",
//         soldOut: false,
//         category: "outfit",
//         details: {
//             sizes: "Free size",
//         }
//     },
//     {
//         id: "outfit-4",
//         name: "LITA",
//         price: 17000,
//         image: "/green-dress.jpg",
//         soldOut: true,
//         category: "outfit",
//         details: {
//             sizes: "8-12",
//         }
//     },
//     {
//         id: "outfit-5",
//         name: "LINA",
//         price: 15000,
//         image: "/brown-dress.jpg",
//         soldOut: false,
//         category: "outfit",
//         details: {
//             sizes: "8-12",
//         }
//     },
//     {
//         id: "outfit-6",
//         name: "FIDAH Set",
//         price: 20000, // Added dummy price
//         image: "/images/outfits/fidah-set.jpg",
//         soldOut: false,
//         category: "outfit",
//         details: {
//             sizes: "8-16",
//         }
//     },
//     // Shoes
//     {
//         id: "shoe-1",
//         name: "HANI",
//         price: 25000, // Added dummy price
//         image: "/hani.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "38-42",
//         }
//     },
//     {
//         id: "shoe-2",
//         name: "DIM",
//         price: 30000, // Added dummy price
//         image: "/dim.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "40-46",
//             gender: "Male",
//         }
//     },
//     {
//         id: "shoe-3",
//         name: "Han",
//         price: 28000, // Added dummy price
//         image: "/han.jpg",
//         soldOut: true,
//         category: "shoe",
//         details: {
//             sizes: "40-46",
//             gender: "Male",
//         }
//     },
//     {
//         id: "shoe-4",
//         name: "Zim",
//         price: 24000, // Added dummy price
//         image: "/zim.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "38-42",
//             gender: "Female",
//         }
//     },
//     {
//         id: "shoe-5",
//         name: "Hanim",
//         price: 32000, // Added dummy price
//         image: "/hanim.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "40-46",
//             gender: "Male",
//         }
//     },
//     {
//         id: "shoe-6",
//         name: "Iman",
//         price: 29000, // Added dummy price
//         image: "/iman.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "40-46",
//             gender: "Male",
//         }
//     },
//     {
//         id: "shoe-7",
//         name: "Faha",
//         price: 26000, // Added dummy price
//         image: "/faha.jpg",
//         soldOut: false,
//         category: "shoe",
//         details: {
//             sizes: "39-42",
//             gender: "Female",
//         }
//     },
//     {
//         id: "shoe-8",
//         name: "Nila",
//         price: 27000, // Added dummy price
//         image: "/nila.jpg",
//         soldOut: true,
//         category: "shoe",
//         details: {
//             sizes: "39-42",
//             gender: "Female",
//         }
//     }
// ];

// // Helper functions to filter products by category
// export const getOutfits = () => productsData.filter(product => product.category === 'outfit');
// export const getShoes = () => productsData.filter(product => product.category === 'shoe');
// export const getAccessories = () => productsData.filter(product => product.category === 'accessory');