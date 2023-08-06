import { useState } from 'react';

function InputSearch({ onSearch, onSetSearchText, searchText }) {
    const handleChangeSearch = (e) => {
        onSetSearchText(e.target.value);
        onSearch(e.target.value);
    };
    return (
        <div className="input-group mb-3 col-4 col-sm-6 float-right p-0">
            <input
                type="text"
                className="form-control"
                value={searchText}
                name="searchText"
                onChange={handleChangeSearch}
                placeholder="Nhập thông tin cần tìm"
            />
            <div className="input-group-append">
                <button className="btn btn-secondary" type="button">
                    <i className="fas fa-search"></i> Tìm kiếm
                </button>
            </div>
        </div>
    );
}

export default InputSearch;
