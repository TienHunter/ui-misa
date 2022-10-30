/**
 * document load xong tài nguyên
 * author VDTien (18/10/2022)
 */
$(document).ready(function () {
   initEvents();
   loadData();
   deleteMulti();
});
/**
 * khởi tạo các sự kiện
 * author: VDTien (20/10/2022)
 */
function initEvents() {
   try {
      // toggle Sidebar
      toggleSidebar();
      // handle click btn thêm mới nhân viên
      $(".main-header__actions .btn__add-employee").click(function () {
         // open Form
         openForm();
      });
      // hanlde tabIndex
      handleTabIndex();
      // handle dropdown records in page pagination
      handleDropdownPaginate();

      // hanlde click btn close form
      $(".form-header__action .m-icon--close").click(function () {
         $(".m-popup-wrapper.warning-close-form").css("display", "flex");
         $(
            ".m-popup-wrapper.warning-close-form .popup-footer__left .btn-sub"
         ).click(function () {
            $(".m-popup-wrapper.warning-close-form").css("display", "none");
         });
         $(
            ".m-popup-wrapper.warning-close-form .popup-footer__right .btn-sub"
         ).click(function () {
            $(".m-popup-wrapper.warning-close-form").css("display", "none");
            $(".textfield__input--required").each(function () {
               $(this).removeClass("textfield--error");
            });
            hideForm();
         });
         $(
            ".m-popup-wrapper.warning-close-form .popup-footer__right .btn-primary"
         ).click(function () {
            $(".m-popup-wrapper.warning-close-form").css("display", "none");
            handleSaveOnClick();
         });
      });
      // hanlde click btn Hủy form
      $(".form-footer__left .btn-sub").click(function () {
         // hide Form
         hideForm();
      });
      // handleSaveOnClick
      $(".form-footer__right .btn-primary").click(handleSaveOnClick);
   } catch (error) {
      console.error(error);
   }
}
/**
 * load dữ liêu từ db
 * author VDTien (21/10/2022)
 */
async function loadData(pageSize = 20, pageNumber = 1) {
   let numberReords;
   let totalPages;
   try {
      // gọi api thực hiện lấy dữ liệu
      await $.ajax({
         type: "GET",
         url: `https://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}`,
         success: function (response) {
            records = response.Data;
            numberReords = response.TotalRecord;
            totalPages = response.TotalPage;
            // empty table current
            $(".m-table__content tbody").empty();
            for (const item of records) {
               // console.log(item);
               const {
                  EmployeeId,
                  EmployeeCode,
                  EmployeeName,
                  Gender,
                  GenderName,
                  DateOfBirth,
                  IdentityNumber,
                  IdentityPlace,
                  DepartmentName,
                  BankAccountNumber,
                  BankName,
                  BankBranchName,
               } = item;
               $(".m-table__content tbody").append(
                  `
                     <tr>
                        <td class="td-anchor td-anchor--start">
                           <input type="checkbox" employeeID=${EmployeeId} />
                        </td>
                        <td>${convertNullString(EmployeeCode)}</td>
                        <td>${convertNullString(EmployeeName)}</td>
                        <td>${convertNullString(GenderName)}</td>
                        <td class="m-text-center">${convertDateOfBirth(
                           DateOfBirth
                        )}</td>
                        <td>${convertNullString(IdentityNumber)}</td>
                        <td>${convertNullString(IdentityPlace)}</td>
                        <td>${convertNullString(DepartmentName)}</td>
                        <td>${convertNullString(BankAccountNumber)}</td>
                        <td>${convertNullString(BankName)}</td>
                        <td>${convertNullString(BankBranchName)}</td>
                        <td class="td-anchor td-anchor--end m-d-flex-auto" >

                              <a href="#" onclick="onEditBtn('${EmployeeId}')">Sửa</a>

                                 <div
                                 class="m-icon m-icon--dropdown"
                                 style="position:relative"
                                 >
                                    <ul class='dropdownlist'>
                                       <li class='dropdown__item' EmployeeCode=${EmployeeCode}>Nhân bản</li>
                                       <li class='dropdown__item' onclick="onDelete('${EmployeeId}')">Xóa</li>
                                    </ul>
                                 </div>
                        </td>
                     </tr>
                  `
               );
            }
            // $(".td-anchor.td-anchor--end a").click(function () {
            //    openForm();
            // });
            $(".m-table_pagination .pagination__left b").text(numberReords);
            // console.log(totalPages);
            renderListPaginate(pageNumber, pageSize, totalPages);
         },
      });

      // xử lý dữ liệu

      // hanlde event click checkbox table
      clickCheckboxTable(numberReords);
      // handle event click dropdown in coloumn action of table
      hamdleClickDropdownActionTable();
      deleteMulti();
   } catch (error) {
      console.log(error);
   }
}
/**
 * toggle sidebar
 * author: VDTien (18/10/2022)
 */
function toggleSidebar() {
   $(".toggle-sidebar .m-icon--menu").click(function () {
      // toggle logo
      $(".header__left").toggle();
      $(this).toggleClass("m-icon--menu-collapse");
      $(this).parent().toggleClass("collapse-sidebar");

      // toggle sidebar
      $(".sidebar").toggleClass("sidebar--collapse");
      $(".sidebar .sidebar-text").fadeToggle();
   });
}
/**
 * open Form employee
 * author VDTien (18/10/2022)
 */
async function openForm(item = {}) {
   $(".m-form-wrapper").css("display", "flex");
   $("#ma_nhan_vien").focus();
   // load dữ liệu departments vào form
   let departments = await getDataDepartments();
   if (departments.length > 0) {
      $("#ten_don_vi ul").empty();
      for (const item of departments) {
         const { DepartmentId, DepartmentName } = item;

         $("#ten_don_vi ul").append(
            `
            <li class="dropdown__item" departmentId=${DepartmentId}>${DepartmentName}</li>
            `
         );
      }
   }
   // click dropdown departments
   $("#ten_don_vi button").click(function () {
      console.log("dropdown department");
      $("#ten_don_vi ul").toggle();
   });

   // select item droplist departments
   $("#ten_don_vi ul li").click(function () {
      let _this = this;
      $("#ten_don_vi ul li").removeClass("active");
      $(this).addClass("active");
      $("#ten_don_vi ul").fadeOut();
      $("#ten_don_vi input").attr({
         value: `${$(_this).text()}`,
         departmentId: `${$(_this).attr("departmentId")}`,
      });
   });
}
/**
 * hide Form employee
 * author VDTien (18/10/2022)
 */
function hideForm(item = {}) {
   $(".m-form-wrapper").css("display", "none");
}
/**
 * xử lý dữ liệu và trả về
 * author VDTien (20/10/2022)
 */
function handleSaveOnClick() {
   // validate dữ liệu
   let isValid = validateData();
   if (isValid) {
      //thu thập dữ liệu
      let maNhanVien = $("#ma_nhan_vien").val();
      let tenNhanVien = $("#ten_nhan_vien").val();
      let maDonVi = $("#ten_don_vi input").attr("departmentId");
      // let maDonVi = "142cb08f-7c31-21fa-8e90-67245e8b283e";
      let chucDanh = $("#chuc_danh").val();
      // let ngaySinh = $("#ngay_sinh").val();
      let ngaySinh = "10/10/2020";
      let gioiTinh;
      let cccd = $("#cccd").val();
      let ngayCapCCCD = $("#ngay_cap_cccd").val();
      let noiCapCCCD = $("#noi_cap_cccd").val();
      let diaChi = $("#dia_chi").val();
      let dtDiDong = $("#sdt").val();
      let dtCoDinh = $("#sdt_co_dinh").val();
      let email = $("#email").val();
      let tkNganHang = $("#tk_ngan_hang").val();
      let tenNganHang = $("#ten_ngan_hang").val();
      let chiNhanh = $("#chi_nhanh").val();
      // handle select gender
      $(
         ".m-form-wrapper .textfield__container--radio input[type='radio'][name='gender-form']"
      ).each(function () {
         if ($(this).prop("checked") == true) {
            gioiTinh = $(this).attr("value");
         }
      });
      let employee = {
         EmployeeCode: maNhanVien,
         EmployeeName: tenNhanVien,
         Gender: gioiTinh,
         PositionName: chucDanh,
         DateOfBirth: ngaySinh,
         IdentityNumber: cccd,
         IdentityDate: ngayCapCCCD,
         IdentityPlace: noiCapCCCD,
         PhoneNumber: dtDiDong,
         DepartmentId: maDonVi,
         Email: email,
         Address: diaChi,
         TelephoneNumber: dtCoDinh,
         BankAccountNumber: tkNganHang,
         BankName: tenNganHang,
         BankBranchName: chiNhanh,
      };

      console.log("employee data: ", employee);
      let statusCode = null;
      // let api = "";
      // let method = "";
      // //Gọi API thực hiện cất dữ liệu

      // if (type == "edit" && employeeID) {
      //    api = `https://amis.manhnv.net/api/v1/employees/${employeeID}`;
      //    method = "PUT";
      // } else {
      //    api = "https://amis.manhnv.net/api/v1/employees";
      //    method = "POST";
      // }
      // console.log("api: ", api);
      fetch(`https://amis.manhnv.net/api/v1/employees`, {
         method: "POST",
         body: JSON.stringify(employee),
         headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
         },
      })
         .then((res) => {
            statusCode = res.status;
            return res.json();
         })
         .then((res) => {
            switch (statusCode) {
               case 400:
                  $(".m-popup-wrapper.error-submit-form").css(
                     "display",
                     "flex"
                  );
                  $(
                     ".m-popup-wrapper.error-submit-form .popup-body__right"
                  ).text(res.userMsg);
                  $(
                     ".m-popup-wrapper.error-submit-form .popup-footer__right .btn-primary"
                  ).click(function () {
                     $(".m-popup-wrapper.error-submit-form").css(
                        "display",
                        "none"
                     );
                  });
                  break;
               case 201: // thêm nhân viên mới thành công
                  // ẩn form
                  hideForm();
                  // hiện toast message
                  $("body").append(
                     `
                              <div class="m-toast-wrapper">
                              <div class="toast-message">
                              <span class="toast-icon toast-icon--succes">
                                 <i class="fa-solid fa-circle-check"></i>
                              </span>
                              <div class="toast-content">
                                 <span class="toast-title toast-title--success">Thành công!</span>
                                 <span class="toast-text">Nhân viên đã được thêm</span>
                              </div>
                              <a href="" class="toast-action">Hoàn tác</a>
                              <button class="toast-close">
                                 <i class="fa-solid fa-xmark"></i>
                              </button>
                           </div>
                              </div>
                           `
                  );

                  $(".m-toast-wrapper").show(function () {
                     $(this).animate({ right: "40px" });
                  });
                  $(".m-toast-wrapper .toast-close").click(function () {
                     $(".m-toast-wrapper").animate(
                        { right: "-500px" },
                        function () {
                           $(this).hide();
                        }
                     );
                  });
                  setTimeout(function () {
                     $(".m-toast-wrapper").animate(
                        { right: "-500px" },
                        function () {
                           $(this).hide();
                        }
                     );
                  }, 3000);

                  loadData();
                  //load lại dữ liệu
                  break;
               default:
                  alert("Đã xảy ra lỗi vui lòng thử lại sau");
                  break;
            }
         })
         .catch((err) => {
            console.log(err);
         });
      //  kiểm tra kết quả trả vê -> đưa ra thông báo
   }
}
/**
 * thực hiện validate dữ liệu
 * author VDTien (20/10/2022)
 */
function validateData() {
   let isValid = true;
   // các thông tin bắt buộc nhập
   $(".textfield__input--required").each(function () {
      // console.log(element);
      let value = $(this).val();
      if (!value) {
         $(this).addClass("textfield--error");
         isValid = false;
      } else {
         $(this).removeClass("textfield--error");
      }
      // $(this).parent().removeClass("textfield--error");
   });
   // các thông tin đúng định dạng

   // ngày tháng
   return isValid;
}
/**
 * thực hiện hành động click checkbox trong table
 * @param {int} numberReords
 * author VDTien (22/10/2022)
 */
function clickCheckboxTable(numberReords) {
   let numberChecked = 0;
   $("#tblEmployee thead th input").click(function () {
      if ($(this).prop("checked") == true) {
         $("#tblEmployee tbody td input").prop("checked", true);
         // $(".batch-excecution").css("display", "block");
         $(".batch-excecution").fadeIn();
         numberChecked = numberReords;
      } else {
         $("#tblEmployee tbody td input").prop("checked", false);
         // $(".batch-excecution").css("display", "none");
         $(".batch-excecution").fadeOut();

         numberChecked = 0;
      }
      // console.log(numberChecked);
   });
   $;
   $("#tblEmployee tbody td input").click(function () {
      if ($(this).prop("checked") == true) {
         $(this).parent().css("background-color", "#f2f9ff");
         $(this).parent().siblings().css("background-color", "#f2f9ff");
         numberChecked++;
      } else {
         $(this).parent().css("background-color", "#fff");
         $(this).parent().siblings().css("background-color", "#fff");
         numberChecked--;
      }
      if (numberChecked === numberReords) {
         $("#tblEmployee thead th input").prop("checked", true);
      } else {
         $("#tblEmployee thead th input").prop("checked", false);
      }
      if (numberChecked > 0) {
         // $(".batch-excecution").css("display", "block");
         $(".batch-excecution").fadeIn();
      } else {
         // $(".batch-excecution").css("display", "none");
         $(".batch-excecution").fadeOut();
      }
   });
}
/**
 * thực hiện lựa chọn "nhân bản hoặc xóa " trong table
 * author VDTien (22/10/2022)
 */
function hamdleClickDropdownActionTable() {
   let _this;
   $(".m-table__content tbody .m-icon--dropdown").click(function () {
      $(".m-table__content tbody .m-icon--dropdown").addClass("no-selected");
      $(".m-table__content tbody .td-anchor.td-anchor--end").css(
         "z-index",
         "unset"
      );
      _this = $(this);
      $(this).removeClass("no-selected");
      $(".m-table__content .td-anchor--end .m-icon--dropdown.no-selected")
         .children()
         .hide();
      $(this).children().toggle();
      $(this).parent().css("z-index", 1);

      $(".m-table__content .td-anchor--end .m-icon--dropdown").css(
         "border",
         "1px solid #fff"
      );
      $(this).css("border", "1px solid #0075c0");
   });

   $(document).click(function (e) {
      if (_this) {
         if (!_this.is(e.target)) {
            _this.children().hide();
            _this.css("border", "1px solid #fff");
         }
      }
   });
}
/**
 * thực hiện get dữ liệu các bộ phận
 * @returns danh sách các bộ phận
 * author VDTien(23/10/2022)
 */
async function getDataDepartments() {
   try {
      let departments = [];
      await $.ajax({
         type: "GET",
         url: "https://amis.manhnv.net/api/v1/Departments",
         success: function (response) {
            departments = [...response];
         },
      });
      // console.log(departments);
      return departments;
   } catch (error) {
      console.log(error);
   }
}
/**
 *
 * @param {string} date
 * @returns cáu trúc DD/MM/YYYY
 * author VDTien(23/10/2022)
 */
function convertDateOfBirth(date) {
   if (checkForamtDate(date)) {
      if (date) {
         date = new Date(date);
         let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
         let month =
            date.getMonth() < 9 ? "0" + date.getMonth() : date.getMonth() + 1;
         let year = date.getFullYear();
         return `${day}-${month}-${year}`;
      }
   }
   return "";
}
/**
 *
 * @param {string} date
 * @returns kiểm tra đầu vào đúng định dạng không
 * author VDTien(23/10/2022)
 */
function checkForamtDate(date) {
   return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
}
/**
 * kiểm tra chuỗi faslthy trả về chuổi rỗng
 * author VDTien(23/10/2022)
 */
function convertNullString(str) {
   return str ? str : "";
}
/**
 * xử lý tabIndex rollback trong form
 * author VDTien(23/10/2022)
 */
function handleTabIndex() {
   $("#btnCancel").keydown(function (e) {
      e.preventDefault();
      let code = e.keyCode || e.which;

      if (code == "9") {
         $("#ma_nhan_vien").focus();
      }
   });
}
function handleDropdownPaginate() {
   $(".m-table_pagination .record-in-page .textfield__icon").click(function () {
      $(
         ".m-table_pagination .record-in-page .dropdownlist--pagination"
      ).toggle();
      // số bản ghi trên 1 trang
      let pageSize;
      $(
         ".m-table_pagination .record-in-page .dropdownlist--pagination .dropdown__item"
      ).click(function () {
         // set value cho thẻ input
         let _this = $(this);
         $(".m-table_pagination .record-in-page input").val(
            _this.text().trim()
         );
         $(".m-table_pagination .record-in-page input").attr({
            numberRecord: _this.attr("value"),
         });
         // ẩn dropdown
         $(this).parent().hide();
         pageSize = $(".m-table_pagination .record-in-page input").attr(
            "numberRecord"
         );
         // load lại table
         loadData(pageSize);
      });
   });
}
/**
 *
 * @param {number} pageNumber
 * @param {number} totalPages
 * xử lý hiển thị phân trang
 */
function renderListPaginate(pageNumber, pageSize, totalPages) {
   console.log("pageNumber : ", pageNumber);
   // render danh sách trang
   $(".pagination-right__action").empty();
   $(".pagination-right__action").append(`
      <span class="btn-pagination btn-pagination__prev ${
         pageNumber == 1 ? "no-click-paginate" : ""
      }">Trước</span>
         <div class="page-list m-d-flex">
            <div class="page-item page-item--current">1</div>
            <div class="page-item">2</div>
         </div>
      <span class="btn-pagination btn-pagination__last ${
         pageNumber == totalPages ? "no-click-paginate" : ""
      }">Sau</span>
   `);
   $(".pagination-right__action .page-list").empty();
   for (let i = 1; i <= totalPages; i++) {
      $(".pagination-right__action .page-list").append(`
   <div class="page-item ${
      i === pageNumber ? "page-item--current" : ""
   }">${i}</div>
   `);
   }
   // xử lý sự kiện chọn trang
   $(".pagination-right__action .page-item").click(function () {
      let pageNumber = parseInt($(this).text().trim());

      console.log("hanlde pagenumber", pageNumber, pageSize);
      loadData(pageSize, pageNumber);
   });
   // xử lý sự kiện click trước sau
   $(".btn-pagination__prev").click(function () {
      if (pageNumber > 1) {
         pageNumber--;
         loadData(pageSize, pageNumber);
      }
   });
   $(".btn-pagination__last").click(function () {
      if (pageNumber < totalPages) {
         pageNumber++;
         loadData(pageSize, pageNumber);
      }
   });
}
async function onEditBtn(employeeID) {
   let employee = null;
   try {
      await $.ajax({
         type: "GET",
         url: `https://amis.manhnv.net/api/v1/Employees/${employeeID}`,
         success: function (response) {
            employee = response;
         },
      });
      console.log(employee);
      // return departments;
   } catch (error) {
      console.log(error);
   }
   openForm();
   if (employee) {
      let {
         Address,
         BankAccountNumber,
         BankBranchName,
         BankName,
         DateOfBirth,
         DepartmentId,
         DepartmentName,
         Email,
         EmployeeCode,
         EmployeePosition,
         EmployeeName,
         Gender,
         GenderName,
         IdentityDate,
         IdentityNumbe,
         IdentityPlace,
         PhoneNumber,
         TelephoneNumber,
      } = employee;

      $("#ma_nhan_vien").val(EmployeeCode);
      $("#ten_nhan_vien").val(EmployeeName);
      $("#ten_don_vi input").attr({
         departmentId: DepartmentId,
         value: DepartmentName,
      });
      //  "142cb08f-7c31-21fa-8e90-67245e8b283e";
      $("#chuc_danh").val(EmployeePosition);
      $("#ngay_sinh").val(convertDateOfBirth(DateOfBirth));
      $(".textfield__input--radio").each(function () {
         if ($(this).attr("value") == Gender) {
            $(this).prop("checked", true);
         }
      });
      $("#cccd").val(IdentityNumbe);
      $("#ngay_cap_cccd").val(IdentityDate);
      $("#noi_cap_cccd").val(IdentityPlace);
      $("#dia_chi").val(Address);
      $("#sdt").val(PhoneNumber);
      $("#sdt_co_dinh").val(TelephoneNumber);
      $("#email").val(Email);
      $("#tk_ngan_hang").val(BankAccountNumber);
      $("#ten_ngan_hang").val(BankName);
      $("#chi_nhanh").val(BankBranchName);
      // handle select gender
      // $(
      //    ".m-form-wrapper .textfield__container--radio input[type='radio'][name='gender-form']"
      // ).each(function () {
      //    if ($(this).prop("checked") == true) {
      //       gioiTinh = $(this).attr("value");
      //    }
      // });
      $(".form-footer__right .btn-primary").click(function () {
         handleSaveOnClick("edit", employeeID);
      });
   }
}
async function onDelete(employeeID) {
   try {
      await $.ajax({
         type: "DELETE",
         url: `https://amis.manhnv.net/api/v1/Employees/${employeeID}`,
         success: function (response) {
            if (response == 1) {
               $("body").append(
                  `
                           <div class="m-toast-wrapper">
                           <div class="toast-message">
                           <span class="toast-icon toast-icon--succes">
                              <i class="fa-solid fa-circle-check"></i>
                           </span>
                           <div class="toast-content">
                              <span class="toast-title toast-title--success">Thành công!</span>
                              <span class="toast-text">Công việc đã bị xóa</span>
                           </div>
                           <a href="" class="toast-action">Hoàn tác</a>
                           <button class="toast-close">
                              <i class="fa-solid fa-xmark"></i>
                           </button>
                        </div>
                           </div>
                        `
               );

               $(".m-toast-wrapper").show(function () {
                  $(this).animate({ right: "40px" });
               });
               $(".m-toast-wrapper .toast-close").click(function () {
                  $(".m-toast-wrapper").animate(
                     { right: "-500px" },
                     function () {
                        $(this).hide();
                     }
                  );
               });
               setTimeout(function () {
                  $(".m-toast-wrapper").animate(
                     { right: "-500px" },
                     function () {
                        $(this).hide();
                     }
                  );
               }, 3000);
            }
         },
      });
      // console.log(departments);
   } catch (error) {
      console.log(error);
   }
   let pageSize;
   pageSize = $(".m-table_pagination .record-in-page input").attr(
      "numberRecord"
   );
   loadData(pageSize);
}
/**
 * xóa nhiều bàn ghỉ
 * author VDTien (30/10/2022)
 */
async function deleteMulti() {
   await $(".batch-excecution .btn-delete").click(function () {
      let arrID = [];
      $(".td-anchor--start input").each(function () {
         if ($(this).prop("checked") == true) {
            let id = $(this).attr("employeeID");
            arrID.push(id);
         }
      });
      console.log("check arr : ", arrID);
      try {
         arrID.forEach((employeeID) => {
            $.ajax({
               type: "DELETE",
               url: `https://amis.manhnv.net/api/v1/Employees/${employeeID}`,
               success: function (response) {
                  console.log("res delete multi");
               },
            });
         });
         // console.log(departments);
      } catch (error) {
         console.log(error);
      }
      let pageSize;
      pageSize = $(".m-table_pagination .record-in-page input").attr(
         "numberRecord"
      );
      $(".batch-excecution").fadeOut();
      loadData(pageSize);
   });
}
