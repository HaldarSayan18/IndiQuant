import AiPicks from '@/components/user_pages/AiPicks';
import AlertComponent from '@/components/user_pages/Alerts';
import CryptoComponent from '@/components/user_pages/Crypto';
import NFTs from '@/components/user_pages/NFTs';
import OrdersComponent from '@/components/user_pages/Orders';
import Portfolio from '@/components/user_pages/Portfolio';
import Settings from '@/components/user_pages/Settings';
import StocksComponent from '@/components/user_pages/Stocks';
import React from 'react'

const Page = async ({ params }) => {
    const { slug } = await params;
    const renderComponent = (slug) => {
        switch (slug) {
            case "stocks":
                return <StocksComponent />;
            case "alerts":
                return <AlertComponent />;
            case "crypto":
                return <CryptoComponent />;
            case "nfts":
                return <NFTs />;
            case "portfolio":
                return <Portfolio />;
            case "orders":
                return <OrdersComponent />;
            case "ai-picks":
                return <AiPicks />;
            case "settings":
                return <Settings />;
            default:
                return <div>404 : Page not found</div>
        }
    };
    return (
        <div className='w-full'>
            {renderComponent(slug)}
        </div>
    )
}

export default Page