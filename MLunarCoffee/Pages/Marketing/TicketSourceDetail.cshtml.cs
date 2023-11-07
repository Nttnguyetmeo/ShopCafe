using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using MLunarCoffee.Comon.Session;

namespace MLunarCoffee.Pages.Marketing
{
    public class TicketSourceDetailModel : PageModel
    {
        public string _SourceDetailID { get; set; }
        public void OnGet()
        {
            string curr = Request.Query ["CurrentID"];
            if (curr != null && curr.ToString() != "")
            {
                _SourceDetailID = curr.ToString();
            }
            else
            {
                _SourceDetailID = "0";

            }
        }

         public async Task<IActionResult> OnPostLoadDataInitialize(int TypeID)
        {
            try
            {
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {
                    dt =await  confunc.ExecuteDataTable("[YYY_sp_SpecificSouce_LoadCombo]", CommandType.StoredProcedure,
                  "@TypeID", SqlDbType.Int, Convert.ToInt32(TypeID == 0 ? 0 : TypeID));
                    dt.TableName = "SpecificSouce";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt =await connFunc.ExecuteDataTable("[YYY_sp_CustomerType_Cat_LoadCombo]", CommandType.StoredProcedure);
                    dt.TableName = "dataTypeCat";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt =await connFunc.ExecuteDataTable("[YYY_sp_TicketSource_LoadDetail]", CommandType.StoredProcedure,
                        "@ID", SqlDbType.Int, Convert.ToInt32(TypeID == 0 ? 0 : TypeID));
                    dt.TableName = "dataDetail";
                    ds.Tables.Add(dt);
                }
                return Content(Comon.DataJson.Dataset(ds));
            }
            catch (Exception e)
            {
                return Content("");
            }
        }

         public async Task<IActionResult> OnPostExcuteData(string data, string CurrentID)
        {
            try
            {
                Unit DataMain = JsonConvert.DeserializeObject<Unit>(data);
                var user = Session.GetUserSession(HttpContext);
                if (CurrentID == "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        DataTable dt =await connFunc.ExecuteDataTable("[YYY_sp_Ticket_Source_Insert]", CommandType.StoredProcedure,
                              "@Name ", SqlDbType.Int, DataMain.Name.Replace("'", "").Trim(),
                              "@Created_By", SqlDbType.Int, user.sys_userid,
                              "@SPID", SqlDbType.Int, DataMain.SpecificSouce,
                              "@GroupID", SqlDbType.Int, DataMain.GroupSouce,
                              "@Created", SqlDbType.DateTime, Comon.Comon.GetDateTimeNow(),
                              "@Note ", SqlDbType.Int, DataMain.Note.Replace("'", "").Trim()
                          );
                        if (dt.Rows.Count > 0)
                        {
                            if (dt.Rows[0][0].ToString() != "0")
                            {
                                return Content("0");
                            }
                            else
                            {
                                return Content("1");
                            }
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
                        DataTable dt =await connFunc.ExecuteDataTable("YYY_sp_ticket_Source_Update", CommandType.StoredProcedure,
                            "@Name", SqlDbType.NVarChar, DataMain.Name.Replace("'", "").Trim(),
                            "@Modified_By", SqlDbType.Int, user.sys_userid,
                            "@SPID", SqlDbType.Int, DataMain.SpecificSouce,
                            "@GroupID", SqlDbType.Int, DataMain.GroupSouce,
                            "@Modified", SqlDbType.DateTime, Comon.Comon.GetDateTimeNow(),
                            "@currentID ", SqlDbType.Int, CurrentID,
                            "@Note ", SqlDbType.NVarChar, DataMain.Note.Replace("'", "").Trim()
                        );
                        if (dt.Rows.Count > 0)
                        {
                            if (dt.Rows[0][0].ToString() != "0")
                            {
                                return Content("0");
                            }
                            else
                            {
                                return Content("1");
                            }
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
    }
    public class Unit
    {
        public string Name { get; set; }
        public string Note { get; set; }
        public string SpecificSouce { get; set; }
        public string GroupSouce { get; set; }

    }
}
