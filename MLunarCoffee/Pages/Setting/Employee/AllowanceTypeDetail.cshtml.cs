﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using MLunarCoffee.Comon.Session;
using System;
using System.Data;
using System.Threading.Tasks;

namespace MLunarCoffee.Pages.Setting.Employee.AllowanceTypeDetail
{
    public class AllowanceTypeDetailModel : PageModel
    {
        public string _ServiceReasonChangeDetailID { get; set; }
        public void OnGet()
        {
            string curr = Request.Query["CurrentID"];
            _ServiceReasonChangeDetailID = curr != null ? curr.ToString() : "0";
        }


        public async Task<IActionResult> OnPostLoadDetail(string CurrentID)
        {
            var user = Session.GetUserSession(HttpContext);
            DataTable dt = new DataTable();
            using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
            {
                dt = await confunc.ExecuteDataTable("[YYY_sp_Setting_AllowanceType_LoadDetail]", CommandType.StoredProcedure,
                    "@ID", SqlDbType.Int, Convert.ToInt32(CurrentID));
            }
            if (dt != null)
            {
                return Content(Comon.DataJson.Datatable(dt));
            }
            else
            {
                return Content("");
            }
        }
        public async Task<IActionResult> OnPostExcuteData(string data, string CurrentID)
        {
            try
            {
                ServiceReasonChange DataMain = JsonConvert.DeserializeObject<ServiceReasonChange>(data);
                var user = Session.GetUserSession(HttpContext);
                if (CurrentID == "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt = await connFunc.ExecuteDataTable("[YYY_sp_Setting_AllowanceType_Insert]", CommandType.StoredProcedure,
                              "@Name ", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                              "@UserID", SqlDbType.Int, user.sys_userid
                          );

                        if (dt.Rows[0][0].ToString() != "1")
                        {
                            return Content("-1");
                        }
                        else
                        {
                            return Content("1");
                        }
                    }
                }
                else
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt = await connFunc.ExecuteDataTable("[YYY_sp_Setting_AllowanceType_Update]", CommandType.StoredProcedure,
                              "@Name ", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                              "@UserID", SqlDbType.Int, user.sys_userid,
                              "@currentID ", SqlDbType.Int, CurrentID
                        );

                        if (dt.Rows[0][0].ToString() != "1")
                        {
                            return Content("-1");
                        }
                        else
                        {
                            return Content("1");
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }
        public class ServiceReasonChange
        {
            public string Name { get; set; }

        }
    }
}
