import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.jsx";

const AestheticsPage = () => {
    const navigate = useNavigate();

    const aesthetics = [
        {
            id: 'old-money',
            name: 'Old Money',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/OldMoney.jpeg',
            description: 'Timeless luxury and sophistication'
        },
        {
            id: 'streetwear',
            name: 'Street Wear',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(2).jpeg',
            description: 'Urban and contemporary style'
        },
        {
            id: 'formals',
            name: 'Formals',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(4).jpeg',
            description: 'Professional and polished looks'
        },
        {
            id: 'athleisure',
            name: 'Athleisure',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26.jpeg',
            description: 'Athletic meets leisure wear'
        },
        {
            id: 'y2k',
            name: 'Y2K',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(1).jpeg',
            description: 'Retro futuristic fashion'
        },
        {
            id: 'casual',
            name: 'Casual',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(1).jpeg',
            description: 'Everyday comfort style'
        },
        {
            id: 'beach',
            name: 'Beach',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.27+(2).jpeg',
            description: 'Summer and resort wear'
        },
        {
            id: 'ethnic',
            name: 'Ethnic',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.31.34.jpeg',
            description: 'Traditional and cultural fashion'
        },
        {
            id: 'party',
            name: 'Party Wear',
            image: 'https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-06-17+at+18.29.26+(3).jpeg',
            description: 'Glamorous evening styles'
        }
    ];

    const handleAestheticClick = (aestheticId) => {
        navigate(`/aesthetic/${aestheticId}`);
    };

    return (
        <div className="max-w-full overflow-x-hidden">
            <div className="wrapper">
                <div className="min-h-screen bg-white">
                    <Header />
                    <div className="p-4 max-w-6xl mx-auto">
                        <div className="text-center mb-6 py-4">
                            <h1 className="text-3xl mb-2 text-gray-800 md:text-4xl">Shop by Aesthetics</h1>
                            <p className="text-base text-gray-600 lg:text-lg">Find your perfect style</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 md:gap-6 md:p-4 lg:grid-cols-3 lg:gap-8 lg:p-6">
                            {aesthetics.map((aesthetic) => (
                                <div
                                    key={aesthetic.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                                    onClick={() => handleAestheticClick(aesthetic.id)}
                                >
                                    <div className="relative pt-[75%] overflow-hidden">
                                        <img
                                            src={aesthetic.image}
                                            alt={aesthetic.name}
                                            loading="lazy"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl mb-1 text-gray-800 lg:text-2xl">{aesthetic.name}</h3>
                                        <p className="text-sm text-gray-600 m-0 lg:text-base">{aesthetic.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AestheticsPage;