using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using MLunarCoffee.Comon.SignalR;
using System.Data;
using System.Threading.Tasks;
using System;
using MLunarCoffee.Comon.Session;
using Newtonsoft.Json;

namespace MLunarCoffee.Pages.WareHouse.Require
{
    public class RequireWareDetailModel : PageModel
    {
        public string _DetailCurrentID { get; set; }
        public string _WareID { get; set; }
        public void OnGet()
        {
            string curr = Request.Query["CurrentID"];
            string ware = Request.Query["WareID"];
            if (curr != null) _DetailCurrentID = curr.ToString(); else _DetailCurrentID = "0";
            if (ware != null) _WareID = ware.ToString(); else _WareID = "0";
        }

        public async Task<IActionResult> OnPostInitialize(string currentid)
        {
            try
            {
                DataSet ds = new DataSet();
                var user = Session.GetUserSession(HttpContext);
                DataTable dt = new DataTable();
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_Get]", CommandType.StoredProcedure);
                    dt.TableName = "Product";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_Unit_Product]", CommandType.StoredProcedure);
                    dt.TableName = "UnitProduct";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_v2_WareHouse_LoadCombo]", CommandType.StoredProcedure
                    , "@UserID", SqlDbType.Int, 0
                    , "@LoadNormal", SqlDbType.Int, 0);
                    dt.TableName = "Warehouse";
                    ds.Tables.Add(dt);
                }

                if (currentid != "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_OrderDetailWare_Info]", CommandType.StoredProcedure
                          , "@OrderID", SqlDbType.Int, Convert.ToInt32(currentid)
                          , "@EditCustomerPassingDate", SqlDbType.Int, user.sys_EditCustomerPassingDate
                          , "@UserID", SqlDbType.Int, user.sys_userid);
                        dt.TableName = "Info";
                        ds.Tables.Add(dt);
                    }
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_OrderDetailWare_Item]", CommandType.StoredProcedure
                           , "@OrderID", SqlDbType.Int, Convert.ToInt32(currentid));
                        dt.TableName = "Items";
                        ds.Tables.Add(dt);
                    }
                }
                return Content(Comon.DataJson.Dataset(ds));

            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }

        public async Task<IActionResult> OnPostLoadProduct()
        {
            try
            {
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_Get]", CommandType.StoredProcedure);
                    dt.TableName = "Product";
                    ds.Tables.Add(dt);
                }
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_Unit_Product]", CommandType.StoredProcedure);
                    dt.TableName = "UnitProduct";
                    ds.Tables.Add(dt);
                }
                return Content(Comon.DataJson.Dataset(ds));
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }

        public async Task<IActionResult> OnPostExcuteData(string currentid, string datamain, string datadetail)
        {
            try
            {
                RequiedWare dataMain = JsonConvert.DeserializeObject<RequiedWare>(datamain);
                DataTable dataDetail = JsonConvert.DeserializeObject<DataTable>(datadetail);
                var user = Session.GetUserSession(HttpContext);
                DataTable dt = new DataTable();
                dt.Columns.Add("packageNumber", typeof(string));
                dt.Columns.Add("idDetail", typeof(int));
                dt.Columns.Add("state", typeof(int));
                dt.Columns.Add("idProduct", typeof(int));
                dt.Columns.Add("SupplierID", typeof(int));
                dt.Columns.Add("UnitCountID", typeof(int));
                dt.Columns.Add("Number", typeof(decimal));
                dt.Columns.Add("Amount", typeof(decimal));
                dt.Columns.Add("Note", typeof(string));
                dt.Columns.Add("ExpiredDay", typeof(DateTime));

                dt.Columns.Add("IniAmount", typeof(decimal));
                dt.Columns.Add("DiscountAmount", typeof(decimal));
                dt.Columns.Add("DiscountPer", typeof(int));
                dt.Columns.Add("UnitPrice", typeof(decimal));
                for (int i = 0; i < dataDetail.Rows.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    dr["packageNumber"] = dataDetail.Rows[i]["packageNumber"];
                    dr["idDetail"] = dataDetail.Rows[i]["idDetail"];
                    dr["state"] = dataDetail.Rows[i]["state"];
                    dr["idProduct"] = dataDetail.Rows[i]["idProduct"];
                    dr["SupplierID"] = 0;
                    dr["UnitCountID"] = dataDetail.Rows[i]["UnitCountID"];
                    dr["Number"] = dataDetail.Rows[i]["Number"];
                    dr["Note"] = dataDetail.Rows[i]["Note"];
                    dr["ExpiredDay"] = Comon.Comon.DateTimeDMY_To_YMD(dataDetail.Rows[i]["ExpiredDay"].ToString());
                    dr["Amount"] = 0;
                    dr["IniAmount"] = 0;
                    dr["DiscountAmount"] = 0;
                    dr["DiscountPer"] = 0;
                    dr["UnitPrice"] = 0;
                    dt.Rows.Add(dr);
                }
                DataTable dtResult = new DataTable();
                if (currentid == "0")
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        dtResult = await connFunc.ExecuteDataTable("YYY_sp_Product_OrderWare_Insert", CommandType.StoredProcedure,
                            "@CreatedBy", SqlDbType.Int, user.sys_userid,
                            "@WareFromID", SqlDbType.Int, dataMain.WareFromID,
                            "@WareToID", SqlDbType.Int, dataMain.WareToID,
                            "@Note", SqlDbType.NVarChar, dataMain.Note != null ? dataMain.Note.Replace("'", "").Trim() : "",
                            "@dt", SqlDbType.Structured, dt.Rows.Count > 0 ? dt : null
                        );
                    }
                }
                else
                {
                    using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                    {
                        dtResult = await connFunc.ExecuteDataTable("YYY_sp_v2_Product_OrderWare_Update", CommandType.StoredProcedure,
                            "@Note", SqlDbType.NVarChar, dataMain.Note != null ? dataMain.Note.Replace("'", "").Trim() : "",
                            "@ModifiedBy", SqlDbType.Int, user.sys_userid,
                            "@WareFromID", SqlDbType.Int, dataMain.WareFromID,
                            "@WareToID", SqlDbType.Int, dataMain.WareToID,
                            "@CurrentID", SqlDbType.Int, Convert.ToInt32(currentid),
                            "@dt", SqlDbType.Structured, dt.Rows.Count > 0 ? dt : null
                        );
                    }
                }
                return Content(Comon.DataJson.Datatable(dtResult));
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }

        public async Task<IActionResult> OnPostDeleteItem(int id)
        {
            try
            {
                var user = Session.GetUserSession(HttpContext);
                DataTable dt = new DataTable();
                using (Models.ExecuteDataBase connFunc = new Models.ExecuteDataBase())
                {
                    dt = await connFunc.ExecuteDataTable("[YYY_sp_Product_OrderWare_Delete]", CommandType.StoredProcedure,
                        "@CurrentID", SqlDbType.Int, id,
                        "@userID", SqlDbType.Int, user.sys_userid
                    );
                }
                return Content(Comon.DataJson.GetFirstValue(dt));
            }
            catch (Exception ex)
            {
                return Content("0");
            }

        }
    }

    public class RequiedWare
    {
        public string WareFromID { get; set; }
        public string WareToID { get; set; }
        public string Note { get; set; }
    }
}
