using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace wallex.Controllers
{
    public class HomeController : Controller
    {

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SmartRebalanceStudy()
        {
            return View();
        }

        public ActionResult OnTimeSmartRebalance()
        {
            return View();
        }

        public ActionResult TepixAnalyse()
        {
            return View();
        }

        [HttpPost]
        [ActionName("getRealPrice")]
        //[ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> SubmitAsync(string symbol,string side)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    


                    string GetRealPriceURL = "https://api.wallex.ir/v1/account/otc/price?symbol=" + symbol + "&side=" + side + "";
                    HttpResponseMessage response = await client.GetAsync(GetRealPriceURL);

                    if (response.IsSuccessStatusCode)
                    {

                        string responseString = await response.Content.ReadAsStringAsync();
                        return Json(new { message = responseString, getTransID = "success", JsonRequestBehavior.AllowGet });
                    }
                    else
                    {
                        return Json(new { message = "not response", getTransID = "fail", JsonRequestBehavior.AllowGet });
                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, getTransID = "fail", JsonRequestBehavior.AllowGet });
            }
        }
    }
}