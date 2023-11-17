import React, { useState } from 'react'
import '../dashboard.css'

//------------components---------------------//
import DashboardNavbar from '../DashboardCmp/DashboardNavbar'
import Footer from '../../layout/Footer'
import Button from '../../components/reuseable/Button'
import Dropdown from '../../components/reuseable/Dropdown'
import RangeInput from '../DashboardCmp/RangeInput'
import Rating from '../../components/reuseable/Rating'

//--------------library----------------------//
import { Link } from 'react-router-dom'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { GrFormClose } from 'react-icons/gr'
import { BsArrowRight } from 'react-icons/bs'
import { BiMap } from 'react-icons/bi'

//-----------------dummay-data-------------------//
import { techData } from '../../constant/DummayTech'

const FindTeacher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [rate, setRate] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('');



  const showInput = () => {
    setIsOpen(!isOpen)
  }
  //////////////////////

  const deleteFun = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };


  ////////////////////
  const addItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, inputValue]);
      setInputValue('');
      setIsOpen(!isOpen);
    }
  };

  //////////filter data///////////
  const filteredData = selectedCategory ? techData.filter(item => item.location === selectedCategory) : techData;


  return (
    <>
      <DashboardNavbar />

      <section>
        <div className="container bg-pink-victor">
          <div className=' bg-pink-victor-box'></div>
          <div className='events-heading'>
            <h6 className='text-center'>Find Teacher</h6>
          </div>
          <div className="row just-between dropdownlist">
            <div className='box-33  one-drop-box'>
              <Dropdown
                title='I want to learn'
                option="Quran, Arabic"
                class={'box-dropdown'}
                value={'Quran, Arabic'} />
            </div>

            <div className='box-33'>
              <Dropdown
                title='Contact preference'
                option="Video Call, Chat"
                class={'box-dropdown'}
                value={'Video Call, Chat'} />
            </div>

            <div className='box-33'>
              <Dropdown
                title='Riwaya'
                option="Hafs"
                class={'box-dropdown'}
                value={'Hafs'} />
            </div>

            <div className='box-33 four-drop-box'>
              <Dropdown
                title='Available time'
                option="Tue, Sat at 12-15, 18-21"
                class={'box-dropdown'}
                value={'Tue, Sat at 12-15, 18-21'} />
            </div>
          </div>
          {/* /////////////////top input field end//////////////// */}

          <div className="event-row">
            <div className="event-box-one">
              <div className='mb form-main'>
                <label for="fname">Sort by </label>
                <select name="cars" id="select-style">
                  <option value="volvo">Best matches</option>
                  <option value="saab">Normal matches </option>
                </select>
              </div>

              <div className='mb form-main'>
                <label for="fname">Country </label>
                <select name="cars" id="select-style" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Bruxelles">Bruxelles</option>
                  <option value="Belgium">Belgium</option>
                </select>
              </div>
              <div className='mb lang-input'>
                <label className='row' for="fname">Language <MdOutlineAddCircleOutline onClick={showInput} /> </label>

              </div>

              <ul>
                {
                  isOpen ?
                    <div className='mb'>
                      <select name="cars" id="select-style" value={inputValue} onChange={(e) => setInputValue(e.target.value)}>
                        <option value="">Select </option>
                        <option value="French">French </option>
                        <option value="English">English</option>
                      </select>

                      <div>
                        {
                          items.length === 2 ?
                            <button disabled className='language-btn'>Add</button> :
                            <button className='language-btn' onClick={addItem}>Add</button>
                        }
                      </div>
                    </div>
                    : null
                }
                {items.slice(0, 2).map((item, index) => (
                  <li className='lang-slect' key={index}>{item} <span onClick={deleteFun}>  <GrFormClose className='point' /></span></li>
                ))}

              </ul>


              <div className='mb form-main'>
                <label for="fname">Ijazah </label>
                <select name="cars" id="select-style">
                  <option value="volvo">Quran Recitation with Tajweed</option>
                  <option value="saab">Quran Recitation with Tajweed</option>
                </select>
              </div>

              <div className='mb form-main Range-box'>
                <label for="fname">Price Range </label>
                <RangeInput />
              </div>
            </div>
            <div className="event-box-two">
              <h5>{techData.length} people fit your preference</h5>
              {
                filteredData?.map((item) => {
                  return (
                    <div key={item.id} className="teacher-box-border">
                      <div className="teacher-card-row">
                        <div className="teacher-card-box1">
                          <Link to={`/teacher-details/${item.id}`}> <img src={item.image} alt="" /></Link>
                          <strong className='d-block'>{item.name}</strong>
                          <small ><BiMap /> {item.location}</small>
                        </div>
                        <div className="teacher-card-box2">
                          <p> Riwaya: <span>{item.Riwaya}</span>  </p>
                          <p> Ijazah: <span>{item.Ijazah} </span>   </p>
                          <p> Language: <span>{item.Language}</span> </p>
                          <p> Contact preference: <span>{item.ContactPreference}</span>   </p>
                          <div className='about-style-bottom'>
                            <p> About me  </p>
                            <small>{item.about.substring(0, 105)}...</small>
                          </div>
                          <Link to={`/teacher-details/${item.id}`}> <div className='row just-cont'>Read more  <BsArrowRight /> </div> </Link>

                        </div>
                        <div className="teacher-card-box3">
                          <ul>
                            <li> <span>${item.dollar}</span> <small>/hour</small>  </li>
                            <li>  <Rating rating={item.rating} onClick={(i) => setRate(i)} />  </li>
                            <li> <Button class={'tech-btn'} data={'Book a Session'}></Button> </li>
                            <li> <Button class={'tech-btn tech-btn-2'} data={'Send Message'}></Button>  </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default FindTeacher

