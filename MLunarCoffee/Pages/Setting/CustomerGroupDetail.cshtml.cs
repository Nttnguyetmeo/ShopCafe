﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using MLunarCoffee.Comon;
using MLunarCoffee.Comon.Session;

namespace MLunarCoffee.Pages.Setting
{
    public class CustomerGroupDetailModel : PageModel
    {
        public string _CustomerGroupID { get; set; }
        public string CurrentPath { get; set; }

        public void OnGet()
        {
            CurrentPath = HttpContext.Request.Path;
            string curr = Request.Query["CurrentID"];
            if (curr != null)
            {
                _CustomerGroupID = curr.ToString();
            }
            else
            {
                _CustomerGroupID = "0";
            }
        }

        public async Task<IActionResult> OnPostLoadInitialize(int CurrentID)
        {
            try
            {
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();

                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    dt = await confunc.ExecuteDataTable("YYY_sp_Discount_Service_Type_LoadList", CommandType.StoredProcedure);
                    dt.TableName = "ServiceType";
                    ds.Tables.Add(dt);
                }

                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    dt = await confunc.ExecuteDataTable("YYY_sp_Discount_Service_LoadList", CommandType.StoredProcedure);
                    dt.TableName = "Service";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    dt = await confunc.ExecuteDataTable("YYY_sp_Customer_Group_LoadDetail", CommandType.StoredProcedure,
                    "@ID", SqlDbType.Int, Convert.ToInt32(CurrentID == 0 ? 0 : CurrentID));
                    dt.TableName = "dataDetail";
                    ds.Tables.Add(dt);
                }

                return Content(Comon.DataJson.Dataset(ds));

            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }


        public async Task<IActionResult> OnPostExcuteData(string data, string CurrentID)
        {
            try
            {
                CustomerGroupDetail DataMain = JsonConvert.DeserializeObject<CustomerGroupDetail>(data);
                var user = Session.GetUserSession(HttpContext);
                if (CurrentID == "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt = await connFunc.ExecuteDataTable("[YYY_sp_Customer_Group_Insert]", CommandType.StoredProcedure,
                           "@Name ", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                           "@Note ", SqlDbType.NVarChar, DataMain.Note.Replace("'", "").Trim(),
                           "@Image", SqlDbType.NVarChar, DataMain.Image.ToString(),
                           "@DataRule", SqlDbType.NVarChar, DataMain.DataRule.ToString(),
                           "@Created_By", SqlDbType.Int, user.sys_userid
                        );
                        if (dt.Rows.Count > 0)
                        {
                            return Content(Comon.DataJson.GetFirstValue(dt));
                        }
                        else
                        {
                            return Content("0");
                        }
                    }
                }
                else
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt = await connFunc.ExecuteDataTable("[YYY_sp_Customer_Group_Update]", CommandType.StoredProcedure,
                            "@Name", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                            "@Modified_By", SqlDbType.Int, user.sys_userid,
                            "@currentID ", SqlDbType.Int, CurrentID,
                            "@Image", SqlDbType.NVarChar, DataMain.Image.ToString(),
                            "@DataRule", SqlDbType.NVarChar, DataMain.DataRule.ToString(),
                            "@Note ", SqlDbType.NVarChar, DataMain.Note.Replace("'", "").Trim()
                        );
                        if (dt.Rows.Count > 0)
                        {
                            return Content(Comon.DataJson.GetFirstValue(dt));
                        }
                        else
                        {
                            return Content("0");
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                return Content("0");
            }


        }
        public class CustomerGroupDetail
        {
            public string Name { get; set; }
            public string Note { get; set; }
            public string Image { get; set; }
            public string DataRule { get; set; }
        }
    }
}
