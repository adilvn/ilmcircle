import React from 'react'
import '../Table/table.css'
import { MdOutlineDone } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
const Table = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    return (
        <>
            <table className='table-risponsive font-small'>
                <thead>
                    <tr>
                        <th scope="col">{'Feature'}</th>
                        <th scope="col">{'Student Basic'}</th>
                        <th scope="col">{'Student Pro Monthly Plan'} </th>
                        <th scope="col">{'Student Pro Yearly Plan'} </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="Account"> </td>
                        <td data-label="Due Date"><small className='text-muted'>{'plan1'}</small></td>
                        <td data-label="Amount"><small className='text-muted'>{'plan2'}</small></td>
                        <td data-label="Period"><small className='text-muted'>{'plan3'}</small>.</td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Account">'{'Hosting'}</td>
                        <td data-label="Due Date"><MdOutlineDone className='text-blue ' /></td>
                        <td data-label="Amount"><MdOutlineDone className='text-blue' /></td>
                        <td data-label="Period"><MdOutlineDone className='text-blue' /></td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Account">{'Domain Connection'}</td>
                        <td data-label="Due Date"><MdOutlineDone className='text-blue' /></td>
                        <td data-label="Amount"><MdOutlineDone className='text-blue' /></td>
                        <td data-label="Period"><MdOutlineDone className='text-blue' /></td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Acount">{'Monthly Visits'}</td>
                        <td data-label="Due Date">25,000</td>
                        <td data-label="Amount">$50,000</td>
                        <td data-label="Period">100,000</td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Acount"><span className='block tb'>{'Designated success team'}</span>
                            <small className='text-muted'>{'A designated customer success team will handle all your queries and questions.'}</small>	</td>
                        <td data-label="Due Date"><span className='block tb'>500</span>
                            <small className='hide'>{'A designated customer success team will handle all your queries and questions.'}</small>
                        </td>

                        <td data-label="Amount"><span className='block tb'>1,000 </span> <small className='text-muted'>{'A designated customer success team will handle all your queries and questions.'}</small></td>
                        <td data-label="Period">  <span className='block tb'> {'Unlimited'}</span>
                            <small className='hide'>{'A designated customer success team will handle all your queries and questions.'}</small>
                        </td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Acount">{'CMS Items'}</td>
                        <td data-label="Due Date"></td>
                        <td data-label="Amount">2,000</td>
                        <td data-label="Period">10,000</td>
                    </tr>
                    <tr>
                        <td scope="row" data-label="Acount">{'SSL Certificate'}</td>
                        <td data-label="Due Date"></td>
                        <td data-label="Amount"></td>
                        <td data-label="Period"><MdOutlineDone className='text-blue' /></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Table
