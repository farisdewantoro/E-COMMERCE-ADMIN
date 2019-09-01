import React, { Component } from 'react'
import {
    Button,
    Grid
} from '@material-ui/core';
class LinkWebsite extends Component {
  render() {
     const list=[
         { name: 'GOOGLE ANALYTIC', link:"https://analytics.google.com/analytics/web/?authuser=1#/report-home/a119403648w176695959p175511858"},
         { name: 'GOOGLE SEARCH', link:"https://search.google.com/u/1/search-console?resource_id=https%3A%2F%2Fhammerstoutdenim.com%2F&hl=id"},
         { name: 'FACEBOOK ANALYTIC', link:"https://www.facebook.com/analytics/365684027172803/?__aref_src=entity_selector&__aref_id=entity_selector&section=overview&force_desktop=true"},
         { name: 'SMS GATEWAY DASHBOARD', link:"http://sms195.xyz/news.php"},
         { name: 'RAJA ONGKIR', link:"https://rajaongkir.com/akun/profil"},
         { name: 'MIDTRANS', link:"https://account.midtrans.com/login"}
     ]
    return (
      <div className="table-responsive ">
            <table className="table table-bordered">
              <tbody>
                {list.map(l=>{
                    return(
                        <tr>
                            <td>
                                {l.name}
                            </td>
                            <td>
                                <a href={l.link} target="_blank">{l.link}</a>
                            </td>
                        </tr>
                       
                    )
                })}  
                 
              </tbody>
          </table>
      </div>
    )
  }
}

export default LinkWebsite;
