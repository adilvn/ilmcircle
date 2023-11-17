import React, { useEffect, useState } from 'react'
import '../prices/prices.css'
import { useTranslation } from 'react-i18next'
//----------------------constant--------------------------------//


//---------------------components------------------------------//
import Header from '../../layout/Header'
import Card from '../../components/reuseable/Card'
import Table from '../../components/Table/Table'
import Accordian from '../../components/Accordian/Accordian'
import { faqs } from '../../components/Accordian/Accordian'
import PeopleSection from '../../components/reuseable/PeopleSection'
import Footer from '../../layout/Footer'
import Cardfree from '../../components/reuseable/Cardfree'
import axios from 'axios'
import { Loader } from '../../components/reuseable/Loader'
import { showMessage } from '../../components/reuseable/Tostify'
import DashboardNavbar from '../../Dashboard/DashboardCmp/DashboardNavbar'
import secureLocalStorage from 'react-secure-storage'


const Prices = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [active, setActive] = useState(null);
  const [loader, setLoader] = useState(false);
  const [pricingData, setPricingData] = useState([]);
  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  }

  useEffect(() => {
    FetchPricingPlan()
  }, [])
  const FetchPricingPlan = () => {
    setLoader(true)

    // Create a FormData instance
    const formdata = new FormData();

    // Configure the request options
    const requestOptions = {
      method: 'get',
      url: 'https://ilmcircle.com/backend/api/page/packages',
      params: formdata,
      responseType: 'json',
    };

    axios(requestOptions)
      .then(response => {
        if (response.status == 200) {
          setPricingData(response?.data?.data)
          setLoader(false)

        } else {
          showMessage(response?.message, 'error')
          setLoader(false)
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoader(false)

      });

  }

  const token = secureLocalStorage.getItem('token')

  return (
    <>
      <section>
        {loader && <div className="loaderScreen">
          <Loader />
        </div>}
        {token ? <DashboardNavbar /> : <Header />}
        <div className="container contain">
          <div className="row prices-main ">
            <div className="price-head ">
              <h6 className=''>{'Pricing'}</h6>
              <p style={{ textAlign: "center" }} className='text-interWord text-center'>{`We've crafted our pricing to offer the ideal blend of affordability and quality, so you can enjoy our platform without stretching your budget.`}</p>
            </div>
          </div>
          <div className='row card-row'>


            {pricingData.map((item, index) => {
              return <div key={index} className="card-box">
                <Card top={item?.price} discount={item?.planDiscount} heading={item?.name} month={`${item.name}`} features={item?.features} showbtn={true} />
              </div>
            })}

          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Prices
