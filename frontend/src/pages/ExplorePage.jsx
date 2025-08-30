// ExplorePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ExplorePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [addedToCart, setAddedToCart] = useState(new Set());
    const [displayName, setDisplayName] = useState('');
    const { type } = useParams();

    // Define the mapping for carousel images and categories
    const carouselImages = {
        women: [
            { type: "wethnic", name: "TRADITIONAL", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/EthnicWomen.jpeg" },
            { type: "partyWomen", name: "PARTY WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/partyWearWomen.jpg" },
            { type: "sportsWomen", name: "ATHLEISURE", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/athlesiureWomen.jpg" },
            { type: "casualWomen", name: "CASUAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/casualsWomen.jpg" },
            { type: "formalWomen", name: "FORMAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/corporateWomen.jpg" },
            { type: "beachW", name: "BEACH WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WomenCarouselimages/vacationWomen.jpg" }
        ],
        men: [
            { type: "formalMen", name: "FORMALS", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/partyMen.jpg" },
            { type: "casuals", name: " CASUAL WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/casualsMen.jpg" },
            { type: "shirtsMen", name: "SHIRTS", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/OldMoneyMen.jpg" },
            { type: "sportsMen", name: "ATHLEISURE", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/sportsMen.jpg" },
            { type: "summerMen", name: "SUMMER WEAR", image: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/MenCarouselimages/vacationMen.jpg" }
        ]
    };

    const categories = {
        women: [
            { name: 'DRESSES', link: 'dressesW', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/dresses.jpg' },
            { name: 'TOP', link: 'topsWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/tops.jpg' },
            { name: 'SPORTS', link: 'sportsWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/sportsw.jpg' },
            { name: 'KURTA', link: 'wethnic', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/kurtaW.jpg' },
            { name: 'CORSET', link: 'cropTopsWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/corsetW.jpg' },
            { name: 'SHIRTS', link: 'formalWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/shirtsW.jpg' },
            { name: 'SKIRT', link: 'skirtsWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/skirtW.jpg' },
            { name: 'SUIT', link: 'formalWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/womenCategory/suitW.jpg ' },
            { name: 'HOODIES', link: 'hoodiesWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/hoodiesW.jpg ' },
            { name: 'BOTTOM', link: 'bottomsWomen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesWomen/bottoms.jpg' },
        ],
        men: [
            { name: 'SHIRTS', link: 'shirtsMen', image: ' https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/shirt.jpg' },
            { name: 'SPORTS', link: 'sportsMen', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/sports.jpg' },
            { name: 'TSHIRT', link: 'casuals', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/t-shirt.jpg' },
            { name: 'TROUSER', link: '', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/CategoryImagesMen/trousers.jpeg' },
            { name: 'KURTA', link: '', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/kurtaMen.jpg' },
            { name: 'FORMALS', link: '', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/formalMen.jpg' },
            { name: 'PANTS', link: '', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/menCategory/pantsMen.jpg' },
            { name: 'HOODIES', link: '', image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/hoodiesMen.jpg' },
        ]
    };

    // Mapping between type and category names for the new API
    const typeToCategoryMapping = {
        // Women's mappings
        'wethnic': 'Religious ceremony',
        'partyWomen': 'Party',
        'sportsWomen': 'Sports',
        'casualWomen': 'Casual',
        'formalWomen': 'Formal',
        'beachW': 'Beach',
        'dressesW': 'Party',
        'topsWomen': 'Tops',
        'cropTopsWomen': 'Crop Tops',
        'skirtsWomen': 'Skirts',
        'hoodiesWomen': 'Hoodies',
        'bottomsWomen': 'Bottoms',
        
        // Men's mappings
        'formalMen': 'Formal',
        'casuals': 'Casual',
        'shirtsMen': 'Shirts',
        'sportsMen': 'Sports',
        'summerMen': 'Summer',
        
        // Add more mappings as needed based on your category structure
    };

    // Function to get display name from type
    const getDisplayName = (type) => {
        const allCarouselItems = [...carouselImages.women, ...carouselImages.men];
        const carouselMatch = allCarouselItems.find(item => item.type === type);
        if (carouselMatch) {
            return carouselMatch.name;
        }

        const allCategories = [...categories.women, ...categories.men];
        const categoryMatch = allCategories.find(item => item.link === type);
        if (categoryMatch) {
            return categoryMatch.name;
        }

        return type?.toUpperCase().replace(/([A-Z])/g, ' $1').trim() || 'PRODUCTS';
    };

    // Function to remove duplicate products based on ID
    const removeDuplicates = (products) => {
        const seen = new Set();
        return products.filter(product => {
            const id = product.id || product._id || product.productId || product.product_id;
            if (seen.has(id)) {
                return false;
            }
            seen.add(id);
            return true;
        });
    };

    // Function to fetch products from both APIs
    const fetchProducts = async (type) => {
        const promises = [];
        
        // First API call - existing endpoint
        promises.push(
            api.get(`/api/products/type/${type}`)
                .then(res => res.data || [])
                .catch(err => {
                    console.warn(`Failed to fetch from type API for ${type}:`, err);
                    return []; // Return empty array on failure
                })
        );

        // Second API call - new category-based endpoint
        const categoryName = typeToCategoryMapping[type];
        if (categoryName) {
            promises.push(
                api.get(`/api/products/by-category/category=${categoryName}`)
                    .then(res => res.data || [])
                    .catch(err => {
                        console.warn(`Failed to fetch from category API for ${categoryName}:`, err);
                        return []; // Return empty array on failure
                    })
            );
        }

        try {
            const results = await Promise.all(promises);
            
            // Combine all results
            const allProducts = results.flat();
            
            // Remove duplicates
            const uniqueProducts = removeDuplicates(allProducts);
            
            console.log(`Fetched ${uniqueProducts.length} unique products for ${type}`);
            console.log('Combined products:', uniqueProducts);
            
            return uniqueProducts;
        } catch (err) {
            console.error('Error in fetchProducts:', err);
            throw err;
        }
    };

    // Function to fetch cart items and update addedToCart state
    const fetchCartItems = async () => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return;

        try {
            let response;
            try {
                response = await api.get('/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                response = await api.get('/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            console.log('Cart response:', response.data);
            
            let cartItems = [];
            if (response.data.items) {
                cartItems = response.data.items;
            } else if (response.data.cart?.items) {
                cartItems = response.data.cart.items;
            } else if (Array.isArray(response.data)) {
                cartItems = response.data;
            } else if (response.data.data) {
                cartItems = response.data.data;
            }
            
            const cartProductIds = cartItems.map(item => {
                return item.productId || 
                       item.product_id || 
                       item.id || 
                       item._id ||
                       item.product?.id ||
                       item.product?._id ||
                       item.product?.productId ||
                       (typeof item === 'string' ? item : null);
            }).filter(Boolean);
            
            console.log('Extracted cart product IDs:', cartProductIds);
            setAddedToCart(new Set(cartProductIds));
        } catch (err) {
            console.error('Failed to fetch cart items:', err);
            console.error('Error details:', err.response?.data);
        }
    };

    useEffect(() => {
        if (!type) {
            setError('No product type specified');
            setLoading(false);
            return;
        }

        setDisplayName(getDisplayName(type));
        setLoading(true);
        setError(null);
        
        // Fetch products from both APIs
        fetchProducts(type)
            .then(combinedProducts => {
                console.log("Combined Products:", combinedProducts);
                setProducts(combinedProducts);
                return fetchCartItems();
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
                setError(`Failed to load ${getDisplayName(type)} products. Please try again later.`);
            })
            .finally(() => setLoading(false));
    }, [type]);

    useEffect(() => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token) {
            fetchCartItems();
        }
    }, []);

    const handleAddToCart = async (product) => {
        const productId = product.id || product._id || product.productId || product.product_id;
        if (!productId) return alert('Product ID is missing!');

        if (addedToCart.has(productId)) {
            return alert('Product is already in your cart!');
        }

        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
            return navigate('/login', {
                state: { from: location.pathname, action: 'addToCart', product }
            });
        }

        try {
            console.log("Adding to cart:", productId);
            console.log("Auth token:", token);

            setAddingToCart(productId);

            await api.post(`/cart/add/${productId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAddedToCart(prev => new Set([...prev, productId]));
            
            const currentAddedItems = JSON.parse(localStorage.getItem('addedToCart') || '[]');
            currentAddedItems.push(productId);
            localStorage.setItem('addedToCart', JSON.stringify(currentAddedItems));
            
            alert('Added to cart successfully!');
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            if (status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                return navigate('/login', {
                    state: {
                        from: location.pathname,
                        message: 'Session expired. Please login again.',
                        action: 'addToCart',
                        product
                    }
                });
            }
            if (status === 404) return alert('Product not found. Please refresh.');
            if (status === 400) return alert('Invalid request.');
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(null);
        }
    };

    const handleProductClick = (product) => {
        console.log("Product being clicked:", product);
        
        const productId = product.id || product._id || product.productId || product.product_id;
        console.log("Product ID:", productId);
        
        if (!productId) {
            console.error("Product has no ID field:", product);
            alert("Product ID is missing!");
            return;
        }
        
        navigate(`/products/${productId}`, { state: { product } });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-xl">Loading {displayName} products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center py-20">
                    <p className="text-red-500 text-xl">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-black hover:text-gray-600 flex items-center"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-center flex-1">{displayName}</h2>
                <div className="w-16"></div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No {displayName} products found</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Browse All Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => {
                        const productId = product.id || product._id || product.productId || product.product_id;
                        const isAddingToCart = addingToCart === productId;
                        const isAlreadyAdded = addedToCart.has(productId);
                        
                        return (
                            <div key={productId || index} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
                                        onClick={() => handleProductClick(product)}
                                    />
                                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                                        ♡
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 
                                        className="text-lg font-semibold mb-2 cursor-pointer hover:text-gray-600 line-clamp-2"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        {product.title}
                                    </h3>
                                    <p className="text-black font-bold mb-4">₹{product.price}</p>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAddingToCart || isAlreadyAdded}
                                        className={`w-full px-4 py-2 rounded transition-colors duration-200 ${
                                            isAlreadyAdded
                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                : isAddingToCart 
                                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                    : 'bg-red-600 text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {isAlreadyAdded ? (
                                            <div className="flex items-center justify-center">
                                                <span className="mr-2">✓</span>
                                                Already Added
                                            </div>
                                        ) : isAddingToCart ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Adding...
                                            </div>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;