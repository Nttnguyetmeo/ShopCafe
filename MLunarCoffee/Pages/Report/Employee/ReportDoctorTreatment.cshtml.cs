using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace SourceMain.Pages.Report.Employee
{
    public class ReportDoctorTreatmentModel : PageModel
    {
        public string _dateTo { get; set; }
        public string _dateFrom { get; set; }
        public string _branchID { get; set; }
        public string _SheetID { get; set; }
        public void OnGet()
        {
            _dateFrom = Request.Query["dateFrom"].ToString();
            _dateTo = Request.Query["dateTo"].ToString();
            _branchID = Request.Query["branch"].ToString();
            _SheetID = Request.Query["sheet"].ToString();
        }

         public async Task<IActionResult> OnPostLoadata(string dateFrom, string dateTo, string branchID, int maxdate)
        {
            try
            {
                var date_From = Comon.Comon.DateTimeDMY_To_YMD(dateFrom);
                var date_To = Comon.Comon.DateTimeDMY_To_YMD(dateTo);
                var totalDate = (date_To - date_From).TotalDays;
                if (totalDate > maxdate)
                {
                    return Content("0");
                }
                DataSet ds = new DataSet();
                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    ds = await confunc.ExecuteDataSet("[ZZZ_sp_Doctor_Efficiency_Treatment]", CommandType.StoredProcedure,
                        "@branch", SqlDbType.NVarChar, branchID
                        , "@datefrom", SqlDbType.DateTime, date_From
                        , "@dateto", SqlDbType.DateTime, date_To);

                }
                if (ds != null)
                {
                    return Content(JsonConvert.SerializeObject(ds, Formatting.Indented));
                }
                else
                {
                    return Content("[]");
                }
            }
            catch (Exception ex)
            {
                return Content("[]");
            }

        }
    }
}
