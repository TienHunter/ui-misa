/**
 * document load xong tài nguyên
 * author VDTien (18/10/2022)
 */
$(document).ready(function () {
   initEvents();
   loadData();
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
            hideForm();
         });
         // hide Form
      });
      // hanlde click btn Hủy form
      $(".form-footer__left .btn-sub").click(function () {
         // hide Form
         hideForm();
      });
      // handleSaveOnClick
      handleSaveOnClick();
   } catch (error) {
      console.error(error);
   }
}
/**
 * load dữ liêu từ db
 * author VDTien (21/10/2022)
 */
async function loadData() {
   let numberReords;
   try {
      // gọi api thực hiện lấy dữ liệu
      await $.ajax({
         type: "GET",
         url: "https://amis.manhnv.net/api/v1/Employees",
         success: function (response) {
            numberReords = response.length;
            // empty table current
            $(".m-table__content tbody").empty();
            for (const item of response) {
               // console.log(item);
               const {
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
                           <input type="checkbox" />
                        </td>
                        <td>${EmployeeCode}</td>
                        <td>${EmployeeName}</td>
                        <td>${GenderName}</td>
                        <td class="m-text-center">${convertDateOfBirth(
                           DateOfBirth
                        )}</td>
                        <td>${IdentityNumber}</td>
                        <td>${IdentityPlace}</td>
                        <td>${DepartmentName}</td>
                        <td>${BankAccountNumber}</td>
                        <td>${BankName}</td>
                        <td>${BankBranchName}</td>
                        <td class="td-anchor td-anchor--end m-d-flex-auto">

                              <a href="#" class>Sửa</a>

                                 <div
                                 class="m-icon m-icon--dropdown"
                                 style="position:relative"
                                 >
                                    <ul class='dropdownlist'>
                                       <li class='dropdown__item'>Nhân bản</li>
                                       <li class='dropdown__item'>Xóa</li>
                                 
                                    </ul>
                                 </div>
                        </td>
                     </tr>
                  `
               );
            }
            $(".td-anchor.td-anchor--end a").click(function () {
               openForm();
            });
            $(document).click(function (e) {
               let _this;
               $(".td-anchor.td-anchor--end .m-icon--dropdown").click(
                  function () {
                     _this = $(this);
                     $(".td-anchor.td-anchor--end .m-icon--dropdown").css(
                        "border",
                        "1px solid #fff"
                     );
                     $(this).css("border", "1px solid #0075c0");
                  }
               );
               if (_this) {
                  if (!_this.is(e.target))
                     _this.css("border", "1px solid #fff");
               }
            });
            $(".m-table_pagination .pagination__left b").text(numberReords);
         },
      });

      // xử lý dữ liệu

      // hanlde event click checkbox table
      clickCheckboxTable(numberReords);
      // handle event click dropdown in coloumn action of table
      hamdleClickDropdownActionTable();
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
      $("#ten_don_vi ul").fadeToggle();
   });

   // select item droplist departments
   $("#ten_don_vi ul li").click(function () {
      let _this = this;
      const { DepartmentId } = $(this).attr("departmentId");
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
   $(".form-footer__right .btn-primary").click(function () {
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
         //Gọi API thực hiện cất dữ liệu
         fetch("https://amis.manhnv.net/api/v1/employees", {
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
   });
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
      $(".m-table__content tbody .m-icon--dropdown.no-selected")
         .children()
         .hide();
      $(this).children().toggle();
      $(this).parent().css("z-index", 1);
   });

   $(document).click(function (e) {
      if (_this) {
         if (!_this.is(e.target)) _this.children().hide();
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
 * @param {date} date
 * @returns cáu trúc DD/MM/YYYY
 */
function convertDateOfBirth(date) {
   if (checkForamtDate(date)) {
      if (date) {
         date = new Date(date);
         let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
         let month =
            date.getMonth() < 9 ? "0" + date.getMonth() : date.getMonth() + 1;
         let year = date.getFullYear();
         return `${day}/${month}/${year}`;
      }
   }
   return "";
}
function checkForamtDate(date) {
   return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
}
