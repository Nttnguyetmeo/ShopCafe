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

namespace MLunarCoffee.Pages.Setting.Manufacture
{
    public class ChairDetailModel : PageModel
    {
        public string _CurrentID { get; set; }
        public string _RoomID { get; set; }
        public string _LevelID { get; set; }
        public void OnGet()
        {
            string curr = Request.Query["CurrentID"];
            string room = Request.Query["RoomID"];
            string level = Request.Query["LevelID"];
            _LevelID = level.ToString();

            if (curr != null)
            {
                _CurrentID = curr.ToString();
            }
            else
            {
                _CurrentID = "0";
            }

            if (room != null)
            {
                _RoomID = room.ToString();
            }
            else
            {
                _RoomID = "0";
            }

        }

         public async Task<IActionResult> OnPostLoadata(int id)
        {
            try
            {
                DataTable dt = new DataTable();
                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    dt =await  confunc.ExecuteDataTable("[YYY_sp_Manufacture_ChairBed_LoadDetail]", CommandType.StoredProcedure,
                      "@ID", SqlDbType.Int, Convert.ToInt32(id == 0 ? 0 : id));
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
            catch
            {
                return Content("");
            }
        }

         public async Task<IActionResult> OnPostExcuteData(string data, string CurrentID)
        {
            try
            {
                var user = Session.GetUserSession(HttpContext);
                ChairInRoom DataMain = JsonConvert.DeserializeObject<ChairInRoom>(data);
                if (CurrentID == "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt =await connFunc.ExecuteDataTable("[YYY_sp_Manufacture_ChairBed_Insert]", CommandType.StoredProcedure,
                              "@Name", SqlDbType.Int, DataMain.Name.Replace("'", "").Trim(),
                              "@Created_By", SqlDbType.Int, user.sys_userid,
                              "@Created", SqlDbType.DateTime, Comon.Comon.GetDateTimeNow(),
                              "@IdRoom", SqlDbType.Int, DataMain.IdRoom
                          );
                        if (dt.Rows.Count > 0)
                        {
                            return Content(JsonConvert.SerializeObject(dt));
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
                        DataTable dt =await connFunc.ExecuteDataTable("YYY_sp_Manufactur_ChairBed_Update", CommandType.StoredProcedure,
                            "@Name", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                            "@Modified_By", SqlDbType.Int, user.sys_userid,
                            "@Modified", SqlDbType.DateTime, Comon.Comon.GetDateTimeNow(), 
                             "@currentID " , SqlDbType.Int, CurrentID

                        );
                        if (dt.Rows.Count > 0)
                        {
                            return Content(JsonConvert.SerializeObject(dt));
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

       
         public async Task<IActionResult> OnPostDeleteItem(string CurrentID)
        {
            try
            {
                var user = Session.GetUserSession(HttpContext);
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    DataTable dt =await connFunc.ExecuteDataTable("YYY_sp_Manufacture_ChairBed_Delete", CommandType.StoredProcedure,
                        "@Modified_By", SqlDbType.Int, user.sys_userid,
                        "@Modified", SqlDbType.DateTime, Comon.Comon.GetDateTimeNow(),
                         "@currentID ", SqlDbType.Int, CurrentID
                    );
                    return Content("1");
                }
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }
    }
    public class ChairInRoom
    {
        public string Name { get; set; }
        public string IdRoom { get; set; }
    }
}
