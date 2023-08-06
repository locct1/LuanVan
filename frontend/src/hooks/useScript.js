import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const useScript = (url) => {
    const navigate = useNavigate();
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false;

        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [url, navigate]);
};

export default useScript;
