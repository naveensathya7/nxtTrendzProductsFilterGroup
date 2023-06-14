import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    rating: '',
    isFetchFailure: false,
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  clearFilters = () => {
    this.setState({category: '', rating: '', searchInput: ''}, this.getProducts)
  }

  updateSearch = value => {
    this.setState({searchInput: value}, this.getProducts)
  }

  updateCategory = categoryId => {
    const {productsList} = this.state
    const categoryFilter = categoryOptions.filter(
      each => each.categoryId === categoryId,
    )
    this.setState({category: categoryFilter[0].categoryId}, this.getProducts)
  }

  updateRating = ratingId => {
    const {productsList} = this.state
    const ratingFilter = ratingsList.filter(each => each.ratingId === ratingId)
    this.setState({rating: ratingFilter[0].ratingId}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, category, rating, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${category}&rating=${rating}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({isFetchFailure: true})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const noProductFound = productsList.length < 1
    console.log(noProductFound)

    // TODOView: Add No Products
    return (
      <div className="all-products-container">
        <FiltersGroup
          categories={categoryOptions}
          ratings={ratingsList}
          updateCategory={this.updateCategory}
          updateRating={this.updateRating}
          clearFilters={this.clearFilters}
          updateSearch={this.updateSearch}
        />
        <div className="products-section">
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
          />

          {noProductFound ? (
            <img
              className="no-products-found-image"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
          ) : (
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailureView = () => (
    <div className="filters-products">
      <FiltersGroup
        categories={categoryOptions}
        ratings={ratingsList}
        updateCategory={this.updateCategory}
        updateRating={this.updateRating}
        clearFilters={this.clearFilters}
      />
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
    </div>
  )

  render() {
    const {isLoading, category, rating, isFetchFailure} = this.state
    console.log(category, rating)

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}

        {isLoading ? (
          this.renderLoader()
        ) : (
          <>
            {isFetchFailure
              ? this.renderFailureView()
              : this.renderProductsList()}
          </>
        )}
      </div>
    )
  }
}

export default AllProductsSection
