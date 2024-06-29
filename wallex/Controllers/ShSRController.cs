using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;

namespace wallex.Controllers
{
    public class ShSRController : Controller
    {
       
        private class APIDATA
        {
            public readonly string WallexURL = "https://api.wallex.ir/";
           
            public string getHistoryAdd(string symbol,string resolution,string fromtimestamp,string totimestamp)
            {
                string Historyadd ="v1/udf/history?symbol=" + symbol + "&resolution=" + resolution + "&from=" + fromtimestamp + "&to=" + totimestamp + "";
                return Historyadd;
            }
        }

        // GET: ShSR
        public ActionResult ShSR()
        {
            return View();
        }

        [HttpPost]
        [ActionName("getInitialHistoryToNow")]
        //[ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> SubmitAsync(string symbol, string resolution)
        {
            try
            {
                int period = 10;
                string resHandler;
               
                if(resolution == "1D")
                {
                    resHandler = "1440";
                }
                else { resHandler = resolution; }
               
                int resolutionInt = int.Parse(resHandler);
                int periodResolution = period * resolutionInt;
                DateTime toTime = DateTime.Now;
                DateTime fromTime = DateTime.Now.AddMinutes(-periodResolution);

               
                
                Int32 toTimestamp = (int)toTime.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
                Int32 fromTimestamp = (int)fromTime.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;

                //toTimestamp = toTimestamp - 12600;
                fromTimestamp = fromTimestamp - 12600;

                string toTimeStampString = toTimestamp.ToString();
                string fromTimeStampString = fromTimestamp.ToString();

                //return Json(new { toTimeStampString = toTimeStampString, fromTimeStampString = fromTimeStampString, JsonRequestBehavior.AllowGet });

                using (HttpClient client = new HttpClient())
                {

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    //client.DefaultRequestHeaders.Add("X-API-Key", "9080|gvP9tDYFqqpb9NMx0rS69CZXltd445EKuD2l9w5C");
                    APIDATA aPIDATA = new APIDATA();

                    string getHistoryAdd = aPIDATA.getHistoryAdd(symbol, resolution, fromTimeStampString, toTimeStampString);
                    string getHistoryURL = aPIDATA.WallexURL + getHistoryAdd;

                    HttpResponseMessage response = await client.GetAsync(getHistoryURL);

                    if (response.IsSuccessStatusCode)
                    {

                        string responseString = await response.Content.ReadAsStringAsync();
                        return Json(new { message = responseString, getSuccess = true, JsonRequestBehavior.AllowGet });
                    }
                    else
                    {
                        return Json(new { message = "response Isn't Success.", getSuccess = false, JsonRequestBehavior.AllowGet });
                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, getSuccess = false, JsonRequestBehavior.AllowGet });
            }
        }
    }
}