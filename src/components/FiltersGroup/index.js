import {BiSearchAlt2} from 'react-icons/bi'
import {Component} from 'react'

import './index.css'

const FiltersGroup = props => {
  const {
    categories,
    ratings,
    updateCategory,
    updateRating,
    clearFilters,
    updateSearch,
  } = props

  let searchVal

  const updateCategoryFilter = id => {
    updateCategory(id)
  }

  const updateRatingFilter = id => {
    updateRating(id)
  }

  const onClickClearFilters = () => {
    clearFilters()
  }

  const onChangeSearch = event => {
    if (event.key === 'Enter') {
      console.log('clicked')
      updateSearch(event.target.value)
    } else {
      searchVal = event.target.value
    }
  }

  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchVal}
          onKeyDown={event => onChangeSearch(event)}
        />
        <BiSearchAlt2 />
      </div>
      <h3 className="category-heading">Category</h3>
      <ul className="categories-list">
        {categories.map(each => (
          <li key={each.name}>
            <p
              className="category-button"
              onClick={() => updateCategoryFilter(each.categoryId)}
            >
              {each.name}
            </p>
          </li>
        ))}
      </ul>
      <h3 className="category-heading">Rating</h3>
      <ul className="ratings-list">
        {ratings.map(each => (
          <li className="ratings-list-item" key={each.ratingId}>
            <button
              className="rating-button"
              type="button"
              onClick={() => updateRatingFilter(each.ratingId)}
            >
              <img
                className="rating-images"
                src={each.imageUrl}
                alt={`rating ${each.ratingId}`}
              />
              <p className="rating-text">& up</p>
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClickClearFilters} className="clear-filters-btn">
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
