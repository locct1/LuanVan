import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        // Gọi hàm xử lý dữ liệu khi form được submit, ví dụ:
        // processSearchQuery(searchQuery);
        event.preventDefault();
        // Sử dụng navigate để điều hướng và cập nhật query parameter
        navigate(`/search-product/?search_product=${searchQuery}`);
    };
    return (
        <>
            <div className="hero__search__form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Bạn cần tìm sản phẩm nào?"
                        id="search_data"
                        className="form-control input-lg ui-autocomplete-input"
                        value={searchQuery}
                        name="q"
                        onChange={handleInputChange}
                        required
                    />
                    <button className="site-btn" type="submit">
                        <i className="fa fa-search" />
                    </button>
                </form>
            </div>
        </>
    );
}

export default Search;
