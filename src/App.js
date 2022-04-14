import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'

import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [newImages, setNewImages] = useState(false)
  const [value, setValue] = useState('')
  const query = useRef('')
  const mounted = useRef(false)
  const [page, setPage] = useState(1)
  const url = `${mainUrl}${clientID}`
  const sUrl = `${searchUrl}${clientID}`
  const fetchPhoto = async () => {
    setLoading(true)
    let finalUrl
    const urlPage = `&page=${page}`
    if (query.current) {
      finalUrl = `${sUrl}${urlPage}&query=${query.current}`
    } else {
      finalUrl = `${url}${urlPage}`
    }
    try {
      const response = await fetch(finalUrl)
      const data = await response.json()
      setPhotos((oldPhotos) => {
        if (query.current && page === 1) {
          return data.results
        } else if (query.current) {
          return [...oldPhotos, ...data.results]
        } else {
          return [...oldPhotos, ...data]
        }
      })
      setNewImages(false)
      setLoading(false)
    } catch (error) {
      setNewImages(false)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPhoto()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (!newImages) return
    if (loading) return
    setPage((oldPage) => oldPage + 1)
  }, [newImages])

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
    // eslint-disable-next-line
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    query.current = value
    if (!query.current) return
    if (page === 1) {
      fetchPhoto()
    }
    setPage(1)
  }
  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            value={value}
            className='form-input'
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((photo, index) => {
            return <Photo key={photo.id} {...photo} />
          })}
        </div>
        {loading && <div className='loading'>Loading...</div>}
      </section>
    </main>
  )
}

export default App
