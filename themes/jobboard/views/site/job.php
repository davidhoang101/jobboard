<?php
foreach ($model as $key => $value) {    

  ?>
  <div class="details" id="searchresult">
    <div class="container">
      <div id="breadcrumb">
        <ul><li itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb">
          <a href="http://www.tuyendungvn.vn/" title="Kiếm việc làm trên Mạng tuyển dụng trực tuyến - tuyendungvn.vn" itemprop="url">
            <span itemprop="title">CareerLink</span></a></li>
            <li itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb">
              <a href="http://www.tuyendungvn.vn/tim-viec-lam-nhanh" title="Tìm Việc Làm Nhanh" itemprop="url">
                <span itemprop="title">Tìm Việc Làm</span></a></li>
                <li itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb">
                  <a href="http://www.tuyendungvn.vn/tim-viec-lam/nhan-vien-tong-vu/593858" itemprop="url"><span itemprop="title"><?php echo $value->title; ?></span></a></li></ul>          </div>

                  <h1>
                    <?php echo $value->title; ?>
                  </h1>
                  <div class="contents">
                    <div id="left">
                      <!-- .job-description -->
                      <div class="job-details">
                        <div class="nopdon clearfix">
                          <a class="nop" href="/nguoi-tim-viec/job/593858/apply">
                            <span>Nộp đơn</span>
                          </a>

                          <a class="save-this-job luuviec" href="#">Lưu việc làm này</a>
                         

                        </div>
                        <table border="1" bordercolor="#efefef" cellpadding="0" cellspacing="0" class="job-description" style="background-color:transparent" width="710">
                          <tbody>
                            <tr class="title">
                              <td colspan="2">Thông tin công ty</td>
                            </tr>
                            <tr>
                              <td class="logo-chitietvieclam" colspan="2">
                                <div class="ttchung">
                                  <img alt="Sansei Vietnam Ltd.,Co" height="80" src="<?php echo $value->com_logo_url; ?>" width="130">
                                  <div class="ntd-chitietvieclam">
                                    <table border="0" bordercolor="#FFCC00" cellpadding="0" cellspacing="5" style="background-color:transparent" width="520">
                                      <tbody>
                                        <tr>
                                          <td valign="top" width="100">Tên công ty:</td>
                                          <td>
                                            <a class="lk-company" href="/viec-lam-cua/sansei-vietnam-ltd.-co/52716"><?php echo $value->com_name; ?></a>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td valign="top" width="100">Website công ty:</td>
                                          <td>
                                            <a href="<?php echo $value->com_web_url; ?>" rel="nofollow" target="_blank"><?php echo $value->com_web_url; ?></a>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td valign="top" width="100">Số nhân viên:</td>
                                          <td>
                                            <?php echo $value->com_members; ?>                                                  </td>
                                          </tr>
                                          <tr>
                                            <td valign="top" width="100">Tên liên hệ:</td>
                                            <td>
                                              <?php echo $value->contact_name; ?>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <div class="hoso">
                                    <div id="firmDescrip" style="clear:both">
                                      <?php echo $value->com_desc; ?>                
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr class="title">
                                <td colspan="2">Mô tả chi tiết công việc</td>
                              </tr>
                              <tr>
                                <td colspan="2">
                                  <div class="hoso">
                                    <div class="mceContentBody">
                                      <?php echo $value->description; ?>  
                                    </div>
                                  </div>
                                </td>

                              </tr>
                              <tr class="title">
                                <td colspan="2">Kinh nghiệm/Kỹ năng chi tiết</td>
                              </tr>
                              <tr>
                                <td colspan="2">
                                  <div class="hoso">
                                    <div class="mceContentBody">
                                      <?php echo $value->job_require; ?>  
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr class="title">
                                <td colspan="2">Thông tin liên hệ</td>
                              </tr>
                              <tr>
                                <td colspan="2">
                                  <ul class="list lienhe clearfix">
                                    <li class="clearfix">
                                      <span class="titbold">Cách liên hệ:</span>
                                      <span> <?php echo $value->contact_way; ?>  </span>
                                    </li>
                                    <li class="clearfix">
                                      <span class="titbold">Mô tả:</span>
                                      <span class="cl-style">
                                       <?php echo $value->contact_des; ?>                    
                                     </span>
                                   </li>
                                   <li class="clearfix">
                                    <span class="titbold">Tên liên hệ:</span>
                                    <span>
                                      <?php echo $value->contact_name; ?> 
                                    </span>
                                  </li>
                                  <li class="clearfix">
                                    <span class="titbold">Địa chỉ:</span>
                                    <span>
                                     <?php echo $value->contact_add; ?> 
                                   </span>
                                 </li>
                               </ul>
                             </td>
                           </tr>
                           <tr>
                            <td colspan="2">
                              <div class="notejob">** Nhận hồ sơ ứng viên bằng ngôn ngữ: <span class="confi_text" style="font-weight:bold"><?php echo $value->cv_lang; ?> </span></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="bottom nopdon clearfix">
                        <a class="nop" href="/nguoi-tim-viec/job/593858/apply">
                          <span>Nộp đơn</span>
                        </a>

                        <a class="save-this-job luuviec" href="#">Lưu việc làm này</a>
                        <div class="thongtinkhac" style="top:25px;right:5px">
                          <div class="ngaydang">
                            Ngày gởi:
                            <span><?php echo $value->created_on; ?> </span>
                            Ngày hết hạn:
                            <span><?php echo $value->end_date; ?> </span>
                          </div>
                        </div>

                      </div>
                      <div id="tag">
                        <div style="width:580px;float:left">
                          Tags:
                          <a href="/viec-lam/tieng-nhat">Tiếng Nhật</a>,                   <a href="/viec-lam/quan-tan-binh">Quận Tân Bình</a>                </div>
                          <span id="socialBot">
                            <span><a href="http://www.facebook.com/sharer.php?u=http%3A%2F%2Fwww.tuyendungvn.vn%2Ftim-viec-lam%2Fnhan-vien-tong-vu%2F593858" target="_blank"> <img border="0" alt="facebook" src="/images/facebook_icon.png?v25"></a></span>
                            <span><a href="http://twitter.com/share?url=http%3A%2F%2Fwww.tuyendungvn.vn%2Ftim-viec-lam%2Fnhan-vien-tong-vu%2F593858&amp;text=Nh%C3%A2n+Vi%C3%AAn+T%E1%BB%95ng+V%E1%BB%A5&amp;via=careerlinkvn" target="_blank"><img border="0" alt="twitter" src="/images/icon_twitter.png?v25"></a></span>
                            <span><a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fwww.tuyendungvn.vn%2Ftim-viec-lam%2Fnhan-vien-tong-vu%2F593858&amp;title=Nh%C3%A2n+Vi%C3%AAn+T%E1%BB%95ng+V%E1%BB%A5&amp;ro=false&amp;summary=&amp;source=" target="_blank"> <img border="0" alt="linkedin" src="/images/linked-in.png?v25"></a></span>
                            <script src="https://apis.google.com/js/plusone.js" ;="" type="text/javascript" gapi_processed="true">{lang: 'vi'}</script>
                            <div id="___plusone_2" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 70px; height: 15px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 70px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 15px;" tabindex="0" vspace="0" width="100%" id="I0_1415352972745" name="I0_1415352972745" src="https://apis.google.com/u/0/se/0/_/+1/fastbutton?usegapi=1&amp;size=small&amp;hl=vi&amp;origin=http%3A%2F%2Fwww.tuyendungvn.vn&amp;url=http%3A%2F%2Fwww.tuyendungvn.vn%2Ftim-viec-lam%2Fnhan-vien-tong-vu%2F593858&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.vi.fYNX2tFSiek.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCME1Iaz4mOVrTnBzW5DKQ1q-OROVA#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh&amp;id=I0_1415352972745&amp;parent=http%3A%2F%2Fwww.tuyendungvn.vn&amp;pfname=&amp;rpctoken=21657586" data-gapiattached="true" title="+1"></iframe></div>
                          </span>
                        </div>

                      </div>
                      <!-- /.job-description -->
                    </div>
                    <div id="right">
                      <!-- .mota -->
                      <div class="mota">
                        <h3>Mô tả</h3>
                        <!-- .list-mota -->
                        <div class="list-mota">
                          <ul style="word-wrap:break-word;">
                            <?php 
                            if($value->job_code){
                            ?>
                            <li>
                              <span>Mã việc làm:</span>
                              <span class="no-link"><?php echo $value->job_code; ?></span>
                            </li>
                            <?php } ?>
                            <li>
                              <span>Ngành nghề việc làm:</span>                              
                              <ul>
                                <?php
                                $cates = Categories::loadByIds($value->id);
                              if($cates){   
                              foreach ($cates as $key => $val) {                                             
                              ?>
                                <li>                                
                                   <?php echo CHtml::link($val->name,array('category','ctid' => $val->id)); ?>
                                </li>
                                <?php 
                                } }
                                ?>
                                <li>
                                  <a href="/viec-lam/thu-ky-hanh-chanh/6">Thư ký/ Hành chánh</a>
                                </li>
                                <li>
                                  <a href="/viec-lam/nhan-su/16">Nhân sự</a>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <span>Cấp bậc:</span>
                              <span class="no-link">
                                <?php echo $value->job_level; ?>
                              </span>
                              </li>
                              <li>
                                <span>Nơi làm việc:</span>
                                <ul>
                                  <?php
                                $cities = Cities::loadByIds($value->id);
                                if($cities){   
                                foreach ($cities as $key => $val) {                                             
                                ?>
                                  <li>                                
                                     <?php echo CHtml::link($val->name,array('category','ctid' => $val->id)); ?>
                                  </li>
                                  <?php 
                                  } }
                                  ?>                                
                                  <li>
                                    <a href="/tim-viec-lam-tai/ho-chi-minh/HCM" title="View Jobs at Location: Hồ Chí Minh">Hồ Chí Minh</a>
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <span>Trình độ học vấn:</span>
                                <span class="no-link">
                                  <?php  echo $value->applicant_level; ?>
                                </span>
                              </li>
                              <li>
                                <span>Mức kinh nghiệm:</span>
                                <span class="no-link">
                                   <?php  echo $value->applicant_experience; ?>
                                </span>
                              </li>
                              <li>
                                <span>Loại công việc:</span>
                                <span class="no-link">
                                   <?php  echo $value->job_type; ?>                        </span>
                                </li>
                                <li>
                                  <span>Lương:</span>
                                  <span class="no-link">
                                     <?php  echo $value->job_salary; ?>                        </span>
                                  </li>
                                  <li>
                                    <span>Tuổi:</span>
                                    <span class="no-link">
                                      <?php  echo $value->applicant_age; ?>                                        
                                    </span>
                                  </li>
                                  <li>
                                    <span>Giới tính:</span>
                                    <span class="no-link">
                                      <?php  echo $value->applicant_gender; ?>                           </span>
                                    </li>
                                  </ul>
                                </div>
                                <!-- /.list-mota -->
                              </div>
                              <!-- /.mota -->
                              <div class="ad">
                                <img alt="Ad Right" height="0" src="/images/ad-right.png?v25" style="display: none !important; visibility: hidden !important; opacity: 0 !important; " width="0">
                              </div>
                            </div>
                          </div>

                          <div id="vieclienquan">
                            <div class="container">
                              <div class="box col-1">
                                <h3>Việc làm từ Công ty này</h3>
                                <ul>
                                  <li>
                                    <a href="/tim-viec-lam/thong-dich-vien-tieng-nhat/582826" title="Thông Dịch Viên Tiếng Nhật">
                                      Thông Dịch Viên Tiếng Nhật
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/ky-su-xay-dung/593859" title="Kỹ Sư Xây Dựng">
                                      Kỹ Sư Xây Dựng
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="box col-2">
                                <h3>Việc làm cùng ngành nghề</h3>
                                <ul>
                                  <li>
                                    <a href="/tim-viec-lam/nhan-vien-tiep-tan-thu-ngan-biet-tieng-nhat/589702" title="Nhân Viên Tiếp Tân &amp; Thu Ngân (Biết Tiếng Nhật)">
                                      Nhân Viên Tiếp Tân &amp; Thu Ngân ...
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/phien-dich-vien-tieng-han-quoc/587696" title="Phiên Dịch Viên Tiếng Hàn Quốc">
                                      Phiên Dịch Viên Tiếng Hàn Quốc
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/tro-ly-kinh-doanh/578167" title="TRỢ LÝ KINH DOANH">
                                      TRỢ LÝ KINH DOANH
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/chuyen-vien-chinh-sach-kinh-doanh/585813" title="Chuyên Viên Chính Sách Kinh Doanh">
                                      Chuyên Viên Chính Sách Kinh Do...
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/admin-tieng-nhat/587423" title="Admin (Tiếng Nhật)">
                                      Admin (Tiếng Nhật)
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="box col-3">
                                <h3>Việc làm liên quan</h3>
                                <ul>
                                  <li>
                                    <a href="/tim-viec-lam/nhan-vien-tong-vu-tieng-nhat/564859" title="Nhân Viên Tổng Vụ (Tiếng Nhật)">
                                      Nhân Viên Tổng Vụ (Tiếng Nhật)
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/phien-dich-vien-tieng-anh/585534" title="Phiên Dịch Viên Tiếng Anh">
                                      Phiên Dịch Viên Tiếng Anh
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/luat-su-tieng-anh/557050" title="Luật Sư (tiếng Anh)">
                                      Luật Sư (tiếng Anh)
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/ke-toan-tieng-hoa/590033" title="Kế Toán Tiếng Hoa">
                                      Kế Toán Tiếng Hoa
                                    </a>
                                  </li>
                                  <li>
                                    <a href="/tim-viec-lam/truong-phong-phap-che/588550" title="Trưởng Phòng Pháp Chế">
                                      Trưởng Phòng Pháp Chế
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <!-- /#vieclienquan -->
                            <!-- =============== -->
                            <!-- = End content = -->
                            <!-- =============== -->
                          </div>
                          <div class="search search-more searchfooter" id="search">
                            <div class="container ui-tabs ui-widget ui-widget-content ui-corner-all">
                              <div id="search-0">
                                <div class="holder clearfix">
                                  <form action="/tim-viec-lam-nang-cao" method="post">
                                    <p class="clearfix nornal">
                                      <label>
                                        <input type="text" id="advancedJobSearch_keywords" name="advancedJobSearch[keywords]" class="search-text" placeholder="Nhập từ khóa..." value="">
                                      </label>
                                      <label class="ml" style="z-index:3000">
                                        <select id="advancedJobSearch_categories" name="advancedJobSearch[categories][]" class="multi-checklist" multiple="multiple" style="display: none;"><option value="31">Bán hàng</option><option value="24">Báo chí/ Biên tập viên/ Xuất bản</option><option value="17">Bảo hiểm</option><option value="29">Bất động sản</option><option value="18">Biên phiên dịch/ Thông dịch viên</option><option value="154">Biên phiên dịch (tiếng Nhật)</option><option value="14">Chăm sóc sức khỏe/ Y tế</option><option value="130">CNTT - Phần cứng/ Mạng</option><option value="19">CNTT - Phần mềm</option><option value="26">Dầu khí/ Khoáng sản</option><option value="33">Dệt may/ Da giày</option><option value="9">Dịch vụ khách hàng</option><option value="28">Dược/ Sinh học</option><option value="148">Điện/ Điện tử</option><option value="10">Giáo dục/ Đào tạo/ Thư viện</option><option value="127">Hóa chất/ Sinh hóa/ Thực phẩm</option><option value="1">Kế toán/ Tài chính/ Kiểm toán</option><option value="15">Khách sạn/ Du lịch</option><option value="139">Kiến trúc</option><option value="11">Kỹ thuật ứng dụng/ Cơ khí</option><option value="20">Lao động phổ thông</option><option value="142">Môi trường/ Xử lý chất thải</option><option value="118">Mới tốt nghiệp/ Thực tập</option><option value="5">Ngân hàng/ Chứng khoán/ Đầu tư</option><option value="4">Nghệ thuật/ Thiết kế/ Giải trí</option><option value="12">Người nước ngoài</option><option value="30">Nhà hàng/ Dịch vụ ăn uống</option><option value="16">Nhân sự</option><option value="3">Nông nghiệp/ Lâm nghiệp</option><option value="151">Ô tô</option><option value="21">Pháp lý/ Luật</option><option value="25">Phi chính phủ/ Phi lợi nhuận</option><option value="145">Quản lý chất lượng (QA/ QC)</option><option value="22">Quản lý điều hành</option><option value="2">Quảng cáo/ Khuyến mãi/ Đối ngoại</option><option value="23">Sản xuất/ Vận hành sản xuất</option><option value="6">Thư ký/ Hành chánh</option><option value="136">Tiếp thị</option><option value="7">Tư vấn</option><option value="34">Vận chuyển/ Giao thông/ Kho bãi</option><option value="27">Vật tư/ Mua hàng</option><option value="32">Viễn Thông</option><option value="8">Xây dựng</option><option value="13">Xuất nhập khẩu/ Ngoại thương</option><option value="35">Khác</option></select><div class="custom dropdown" style="width: 260px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 240px;"><a class="current">Tất cả ngành nghề</a><a class="selector" href="#"></a></div><ul class="multiDropMain ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" style="width: 260px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_categories-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-0" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="31" title="Bán hàng"><span>Bán hàng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-1" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="24" title="Báo chí/ Biên tập viên/ Xuất bản"><span>Báo chí/ Biên tập viên/ Xuất bản</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-2" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="17" title="Bảo hiểm"><span>Bảo hiểm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-3" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="29" title="Bất động sản"><span>Bất động sản</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-4" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="18" title="Biên phiên dịch/ Thông dịch viên"><span>Biên phiên dịch/ Thông dịch viên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-5" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-5" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="154" title="Biên phiên dịch (tiếng Nhật)"><span>Biên phiên dịch (tiếng Nhật)</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-6" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-6" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="14" title="Chăm sóc sức khỏe/ Y tế"><span>Chăm sóc sức khỏe/ Y tế</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-7" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-7" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="130" title="CNTT - Phần cứng/ Mạng"><span>CNTT - Phần cứng/ Mạng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-8" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-8" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="19" title="CNTT - Phần mềm"><span>CNTT - Phần mềm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-9" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-9" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="26" title="Dầu khí/ Khoáng sản"><span>Dầu khí/ Khoáng sản</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-10" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-10" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="33" title="Dệt may/ Da giày"><span>Dệt may/ Da giày</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-11" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-11" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="9" title="Dịch vụ khách hàng"><span>Dịch vụ khách hàng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-12" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-12" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="28" title="Dược/ Sinh học"><span>Dược/ Sinh học</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-13" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-13" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="148" title="Điện/ Điện tử"><span>Điện/ Điện tử</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-14" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-14" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="10" title="Giáo dục/ Đào tạo/ Thư viện"><span>Giáo dục/ Đào tạo/ Thư viện</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-15" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-15" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="127" title="Hóa chất/ Sinh hóa/ Thực phẩm"><span>Hóa chất/ Sinh hóa/ Thực phẩm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-16" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-16" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="1" title="Kế toán/ Tài chính/ Kiểm toán"><span>Kế toán/ Tài chính/ Kiểm toán</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-17" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-17" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="15" title="Khách sạn/ Du lịch"><span>Khách sạn/ Du lịch</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-18" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-18" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="139" title="Kiến trúc"><span>Kiến trúc</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-19" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-19" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="11" title="Kỹ thuật ứng dụng/ Cơ khí"><span>Kỹ thuật ứng dụng/ Cơ khí</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-20" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-20" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="20" title="Lao động phổ thông"><span>Lao động phổ thông</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-21" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-21" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="142" title="Môi trường/ Xử lý chất thải"><span>Môi trường/ Xử lý chất thải</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-22" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-22" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="118" title="Mới tốt nghiệp/ Thực tập"><span>Mới tốt nghiệp/ Thực tập</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-23" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-23" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="5" title="Ngân hàng/ Chứng khoán/ Đầu tư"><span>Ngân hàng/ Chứng khoán/ Đầu tư</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-24" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-24" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="4" title="Nghệ thuật/ Thiết kế/ Giải trí"><span>Nghệ thuật/ Thiết kế/ Giải trí</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-25" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-25" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="12" title="Người nước ngoài"><span>Người nước ngoài</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-26" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-26" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="30" title="Nhà hàng/ Dịch vụ ăn uống"><span>Nhà hàng/ Dịch vụ ăn uống</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-27" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-27" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="16" title="Nhân sự"><span>Nhân sự</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-28" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-28" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="3" title="Nông nghiệp/ Lâm nghiệp"><span>Nông nghiệp/ Lâm nghiệp</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-29" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-29" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="151" title="Ô tô"><span>Ô tô</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-30" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-30" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="21" title="Pháp lý/ Luật"><span>Pháp lý/ Luật</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-31" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-31" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="25" title="Phi chính phủ/ Phi lợi nhuận"><span>Phi chính phủ/ Phi lợi nhuận</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-32" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-32" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="145" title="Quản lý chất lượng (QA/ QC)"><span>Quản lý chất lượng (QA/ QC)</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-33" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-33" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="22" title="Quản lý điều hành"><span>Quản lý điều hành</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-34" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-34" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="2" title="Quảng cáo/ Khuyến mãi/ Đối ngoại"><span>Quảng cáo/ Khuyến mãi/ Đối ngoại</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-35" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-35" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="23" title="Sản xuất/ Vận hành sản xuất"><span>Sản xuất/ Vận hành sản xuất</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-36" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-36" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="6" title="Thư ký/ Hành chánh"><span>Thư ký/ Hành chánh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-37" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-37" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="136" title="Tiếp thị"><span>Tiếp thị</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-38" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-38" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="7" title="Tư vấn"><span>Tư vấn</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-39" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-39" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="34" title="Vận chuyển/ Giao thông/ Kho bãi"><span>Vận chuyển/ Giao thông/ Kho bãi</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-40" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-40" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="27" title="Vật tư/ Mua hàng"><span>Vật tư/ Mua hàng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-41" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-41" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="32" title="Viễn Thông"><span>Viễn Thông</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-42" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-42" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="8" title="Xây dựng"><span>Xây dựng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-43" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-43" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="13" title="Xuất nhập khẩu/ Ngoại thương"><span>Xuất nhập khẩu/ Ngoại thương</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_categories-option-44" title="" class=""><input id="multiDrop-advancedJobSearch_categories-option-44" name="multiDrop_advancedJobSearch_categories" type="checkbox" value="35" title="Khác"><span>Khác</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                      </label>
                                      <label class="ml">
                                        <select id="advancedJobSearch_provinces" name="advancedJobSearch[provinces][]" class="multi-checklist" multiple="multiple" style="display: none;"><option value="23">Hồ Chí Minh</option><option value="27">Hà Nội</option><option value="17">Đà Nẵng</option><option value="1">An Giang</option><option value="9">Bà Rịa - Vũng Tàu</option><option value="5">Bắc Cạn</option><option value="4">Bắc Giang</option><option value="6">Bạc Liêu</option><option value="7">Bắc Ninh</option><option value="11">Bến Tre</option><option value="3">Bình Định</option><option value="2">Bình Dương</option><option value="8">Bình Phước</option><option value="10">Bình Thuận</option><option value="13">Cà Mau</option><option value="14">Cần Thơ</option><option value="12">Cao Bằng</option><option value="16">Đắk Lắk</option><option value="18">Đăk Nông</option><option value="15">Điện Biên</option><option value="19">Đồng Nai</option><option value="20">Đồng Tháp</option><option value="21">Gia Lai</option><option value="25">Hà Giang</option><option value="28">Hà Nam</option><option value="30">Hà Tây</option><option value="31">Hà Tĩnh</option><option value="24">Hải Dương</option><option value="29">Hải Phòng</option><option value="26">Hậu Giang</option><option value="22">Hòa Bình</option><option value="32">Hưng Yên</option><option value="33">Kiên Giang</option><option value="34">Khánh Hòa</option><option value="35">Kon Tum</option><option value="65">Lai Châu</option><option value="38">Lâm Đồng</option><option value="39">Lạng Sơn</option><option value="66">Lào Cai</option><option value="36">Long An</option><option value="42">Nam Định</option><option value="40">Nghệ An</option><option value="41">Ninh Bình</option><option value="43">Ninh Thuận</option><option value="44">Phú Thọ</option><option value="45">Phú Yên</option><option value="46">Quảng Bình</option><option value="47">Quảng Nam</option><option value="49">Quảng Ngãi</option><option value="48">Quảng Ninh</option><option value="50">Quảng Trị</option><option value="52">Sóc Trăng</option><option value="51">Sơn La</option><option value="56">Tây Ninh</option><option value="53">Thái Bình</option><option value="57">Thái Nguyên</option><option value="55">Thanh Hóa</option><option value="74">Thừa Thiên - Huế</option><option value="54">Tiền Giang</option><option value="75">Trà Vinh</option><option value="73">Tuyên Quang</option><option value="76">Vĩnh Long</option><option value="77">Vĩnh Phúc</option><option value="78">Yên Bái</option><option value="79">Khác</option><option value="80">Nước Ngoài</option><option value="134">Nhật Bản</option></select><div class="custom dropdown" style="width: 260px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 240px;"><a class="current">Tất cả địa điểm</a><a class="selector" href="#"></a></div><ul class="multiDropMain" style="width: 260px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-0" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="23" title="Hồ Chí Minh"><span>Hồ Chí Minh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-1" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="27" title="Hà Nội"><span>Hà Nội</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-2" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="17" title="Đà Nẵng"><span>Đà Nẵng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-3" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="1" title="An Giang"><span>An Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-4" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="9" title="Bà Rịa - Vũng Tàu"><span>Bà Rịa - Vũng Tàu</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-5" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-5" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="5" title="Bắc Cạn"><span>Bắc Cạn</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-6" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-6" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="4" title="Bắc Giang"><span>Bắc Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-7" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-7" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="6" title="Bạc Liêu"><span>Bạc Liêu</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-8" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-8" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="7" title="Bắc Ninh"><span>Bắc Ninh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-9" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-9" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="11" title="Bến Tre"><span>Bến Tre</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-10" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-10" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="3" title="Bình Định"><span>Bình Định</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-11" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-11" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="2" title="Bình Dương"><span>Bình Dương</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-12" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-12" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="8" title="Bình Phước"><span>Bình Phước</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-13" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-13" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="10" title="Bình Thuận"><span>Bình Thuận</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-14" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-14" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="13" title="Cà Mau"><span>Cà Mau</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-15" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-15" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="14" title="Cần Thơ"><span>Cần Thơ</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-16" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-16" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="12" title="Cao Bằng"><span>Cao Bằng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-17" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-17" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="16" title="Đắk Lắk"><span>Đắk Lắk</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-18" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-18" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="18" title="Đăk Nông"><span>Đăk Nông</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-19" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-19" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="15" title="Điện Biên"><span>Điện Biên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-20" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-20" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="19" title="Đồng Nai"><span>Đồng Nai</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-21" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-21" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="20" title="Đồng Tháp"><span>Đồng Tháp</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-22" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-22" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="21" title="Gia Lai"><span>Gia Lai</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-23" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-23" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="25" title="Hà Giang"><span>Hà Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-24" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-24" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="28" title="Hà Nam"><span>Hà Nam</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-25" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-25" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="30" title="Hà Tây"><span>Hà Tây</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-26" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-26" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="31" title="Hà Tĩnh"><span>Hà Tĩnh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-27" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-27" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="24" title="Hải Dương"><span>Hải Dương</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-28" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-28" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="29" title="Hải Phòng"><span>Hải Phòng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-29" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-29" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="26" title="Hậu Giang"><span>Hậu Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-30" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-30" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="22" title="Hòa Bình"><span>Hòa Bình</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-31" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-31" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="32" title="Hưng Yên"><span>Hưng Yên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-32" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-32" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="33" title="Kiên Giang"><span>Kiên Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-33" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-33" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="34" title="Khánh Hòa"><span>Khánh Hòa</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-34" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-34" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="35" title="Kon Tum"><span>Kon Tum</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-35" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-35" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="65" title="Lai Châu"><span>Lai Châu</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-36" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-36" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="38" title="Lâm Đồng"><span>Lâm Đồng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-37" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-37" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="39" title="Lạng Sơn"><span>Lạng Sơn</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-38" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-38" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="66" title="Lào Cai"><span>Lào Cai</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-39" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-39" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="36" title="Long An"><span>Long An</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-40" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-40" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="42" title="Nam Định"><span>Nam Định</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-41" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-41" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="40" title="Nghệ An"><span>Nghệ An</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-42" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-42" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="41" title="Ninh Bình"><span>Ninh Bình</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-43" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-43" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="43" title="Ninh Thuận"><span>Ninh Thuận</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-44" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-44" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="44" title="Phú Thọ"><span>Phú Thọ</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-45" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-45" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="45" title="Phú Yên"><span>Phú Yên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-46" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-46" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="46" title="Quảng Bình"><span>Quảng Bình</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-47" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-47" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="47" title="Quảng Nam"><span>Quảng Nam</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-48" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-48" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="49" title="Quảng Ngãi"><span>Quảng Ngãi</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-49" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-49" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="48" title="Quảng Ninh"><span>Quảng Ninh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-50" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-50" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="50" title="Quảng Trị"><span>Quảng Trị</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-51" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-51" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="52" title="Sóc Trăng"><span>Sóc Trăng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-52" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-52" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="51" title="Sơn La"><span>Sơn La</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-53" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-53" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="56" title="Tây Ninh"><span>Tây Ninh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-54" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-54" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="53" title="Thái Bình"><span>Thái Bình</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-55" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-55" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="57" title="Thái Nguyên"><span>Thái Nguyên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-56" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-56" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="55" title="Thanh Hóa"><span>Thanh Hóa</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-57" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-57" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="74" title="Thừa Thiên - Huế"><span>Thừa Thiên - Huế</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-58" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-58" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="54" title="Tiền Giang"><span>Tiền Giang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-59" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-59" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="75" title="Trà Vinh"><span>Trà Vinh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-60" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-60" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="73" title="Tuyên Quang"><span>Tuyên Quang</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-61" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-61" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="76" title="Vĩnh Long"><span>Vĩnh Long</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-62" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-62" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="77" title="Vĩnh Phúc"><span>Vĩnh Phúc</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-63" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-63" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="78" title="Yên Bái"><span>Yên Bái</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-64" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-64" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="79" title="Khác"><span>Khác</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-65" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-65" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="80" title="Nước Ngoài"><span>Nước Ngoài</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_provinces-option-66" title="" class=""><input id="multiDrop-advancedJobSearch_provinces-option-66" name="multiDrop_advancedJobSearch_provinces" type="checkbox" value="134" title="Nhật Bản"><span>Nhật Bản</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                      </label>
                                      <input style="margin-top:0" id="search-top" type="submit" value="search">
                                    </p>
                                    <div class="searchmore clearfix" id="search-more">
                                      <p class="clearfix" style="z-index:5">
                                        <span class="notimg">Trình độ học vấn:</span>
                                        <label>
                                          <select id="advancedJobSearch_educationLevels" name="advancedJobSearch[educationLevels][]" class="multi-checklist" multiple="multiple" style="display: none;"><option value="1">PTCS</option><option value="2">Trung học</option><option value="3">Chứng chỉ</option><option value="4">Trung cấp</option><option value="5">Cao đẳng</option><option value="6">Cử nhân</option><option value="7">Kỹ sư</option><option value="8">Thạc sĩ</option><option value="9">Thạc sĩ Nghệ thuật</option><option value="10">Thạc sĩ Thương mại</option><option value="11">Thạc sĩ Khoa học</option><option value="12">Thạc sĩ Kiến trúc</option><option value="13">Thạc sĩ QTKD</option><option value="14">Thạc sĩ Kỹ thuật ứng dụng</option><option value="15">Thạc sĩ Luật</option><option value="16">Thạc sĩ Y học</option><option value="17">Thạc sĩ Dược phẩm</option><option value="18">Tiến sĩ</option><option value="19">Khác</option></select><div class="custom dropdown" style="width: 262px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 242px;"><a class="current">Tất cả</a><a class="selector" href="#"></a></div><ul class="multiDropMain" style="width: 262px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-0" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="1" title="PTCS"><span>PTCS</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-1" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="2" title="Trung học"><span>Trung học</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-2" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="3" title="Chứng chỉ"><span>Chứng chỉ</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-3" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="4" title="Trung cấp"><span>Trung cấp</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-4" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="5" title="Cao đẳng"><span>Cao đẳng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-5" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-5" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="6" title="Cử nhân"><span>Cử nhân</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-6" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-6" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="7" title="Kỹ sư"><span>Kỹ sư</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-7" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-7" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="8" title="Thạc sĩ"><span>Thạc sĩ</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-8" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-8" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="9" title="Thạc sĩ Nghệ thuật"><span>Thạc sĩ Nghệ thuật</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-9" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-9" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="10" title="Thạc sĩ Thương mại"><span>Thạc sĩ Thương mại</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-10" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-10" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="11" title="Thạc sĩ Khoa học"><span>Thạc sĩ Khoa học</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-11" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-11" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="12" title="Thạc sĩ Kiến trúc"><span>Thạc sĩ Kiến trúc</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-12" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-12" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="13" title="Thạc sĩ QTKD"><span>Thạc sĩ QTKD</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-13" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-13" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="14" title="Thạc sĩ Kỹ thuật ứng dụng"><span>Thạc sĩ Kỹ thuật ứng dụng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-14" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-14" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="15" title="Thạc sĩ Luật"><span>Thạc sĩ Luật</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-15" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-15" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="16" title="Thạc sĩ Y học"><span>Thạc sĩ Y học</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-16" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-16" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="17" title="Thạc sĩ Dược phẩm"><span>Thạc sĩ Dược phẩm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-17" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-17" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="18" title="Tiến sĩ"><span>Tiến sĩ</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_educationLevels-option-18" title="" class=""><input id="multiDrop-advancedJobSearch_educationLevels-option-18" name="multiDrop_advancedJobSearch_educationLevels" type="checkbox" value="19" title="Khác"><span>Khác</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                        </label>
                                      </p>
                                      <p class="linefn clearfix" style="z-index:4">
                                        <span class="notimg">Loại công việc:</span>
                                        <label>
                                          <select id="advancedJobSearch_positionTypes" name="advancedJobSearch[positionTypes][]" class="multi-checklist" multiple="multiple" style="display: none;"><option value="A">Toàn thời gian cố định</option><option value="B">Toàn thời gian tạm thời</option><option value="C">Bán thời gian</option><option value="D">Bán thời gian tạm thời</option><option value="E">Hợp đồng</option><option value="F">Khác</option></select><div class="custom dropdown" style="width: 262px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 242px;"><a class="current">Tất cả</a><a class="selector" href="#"></a></div><ul class="multiDropMain" style="width: 262px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-0" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="A" title="Toàn thời gian cố định"><span>Toàn thời gian cố định</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-1" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="B" title="Toàn thời gian tạm thời"><span>Toàn thời gian tạm thời</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-2" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="C" title="Bán thời gian"><span>Bán thời gian</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-3" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="D" title="Bán thời gian tạm thời"><span>Bán thời gian tạm thời</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-4" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="E" title="Hợp đồng"><span>Hợp đồng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_positionTypes-option-5" title="" class=""><input id="multiDrop-advancedJobSearch_positionTypes-option-5" name="multiDrop_advancedJobSearch_positionTypes" type="checkbox" value="F" title="Khác"><span>Khác</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                        </label>
                                      </p>
                                      <p class="linef clearfix" style="z-index:3">
                                        <span class="notimg">Cấp bậc:</span>
                                        <label>
                                          <select id="advancedJobSearch_careerLevels" name="advancedJobSearch[careerLevels][]" class="multi-checklist normal" multiple="multiple" style="display: none;"><option value="I">Sinh viên/ Thực tập sinh</option><option value="N">Mới đi làm</option><option value="L">Nhân viên</option><option value="T">Kỹ thuật viên/Kỹ sư</option><option value="P">Trưởng nhóm / Giám sát</option><option value="M">Quản lý / Trưởng phòng</option><option value="D">Giám đốc</option><option value="S">Quản lý cấp cao</option><option value="E">Điều hành cấp cao</option></select><div class="custom dropdown" style="width: 262px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 242px;"><a class="current">Tất cả</a><a class="selector" href="#"></a></div><ul class="multiDropMain" style="width: 262px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-0" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="I" title="Sinh viên/ Thực tập sinh"><span>Sinh viên/ Thực tập sinh</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-1" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="N" title="Mới đi làm"><span>Mới đi làm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-2" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="L" title="Nhân viên"><span>Nhân viên</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-3" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="T" title="Kỹ thuật viên/Kỹ sư"><span>Kỹ thuật viên/Kỹ sư</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-4" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="P" title="Trưởng nhóm / Giám sát"><span>Trưởng nhóm / Giám sát</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-5" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-5" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="M" title="Quản lý / Trưởng phòng"><span>Quản lý / Trưởng phòng</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-6" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-6" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="D" title="Giám đốc"><span>Giám đốc</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-7" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-7" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="S" title="Quản lý cấp cao"><span>Quản lý cấp cao</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_careerLevels-option-8" title="" class=""><input id="multiDrop-advancedJobSearch_careerLevels-option-8" name="multiDrop_advancedJobSearch_careerLevels" type="checkbox" value="E" title="Điều hành cấp cao"><span>Điều hành cấp cao</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                        </label>
                                      </p>
                                      <p class="linef clearfix" style="z-index:2">
                                        <span class="notimg">Mức kinh nghiệm:</span>
                                        <label>
                                          <select id="advancedJobSearch_experienceLevels" name="advancedJobSearch[experienceLevels][]" class="multi-checklist normal" multiple="multiple" style="display: none;"><option value="A">0-1 năm kinh nghiệm</option><option value="B">1-2 năm kinh nghiệm</option><option value="C">2-5 năm kinh nghiệm</option><option value="D">5-10 năm kinh nghiệm</option><option value="E">Hơn 10 năm kinh nghiệm</option></select><div class="custom dropdown" style="width: 262px;"><div class="clear" href="" aria-haspopup="true" tabindex="0" style="width: 242px;"><a class="current">Tất cả</a><a class="selector" href="#"></a></div><ul class="multiDropMain" style="width: 262px;"><div class="multiDropHeader clearfix"><div class="reset"><a class="multiDropAll" href="#"><span>Chọn tất cả</span></a></div></div><div class="multiDrop reset"><li class=""><label for="multiDrop-advancedJobSearch_experienceLevels-option-0" title="" class=""><input id="multiDrop-advancedJobSearch_experienceLevels-option-0" name="multiDrop_advancedJobSearch_experienceLevels" type="checkbox" value="A" title="0-1 năm kinh nghiệm"><span>0-1 năm kinh nghiệm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_experienceLevels-option-1" title="" class=""><input id="multiDrop-advancedJobSearch_experienceLevels-option-1" name="multiDrop_advancedJobSearch_experienceLevels" type="checkbox" value="B" title="1-2 năm kinh nghiệm"><span>1-2 năm kinh nghiệm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_experienceLevels-option-2" title="" class=""><input id="multiDrop-advancedJobSearch_experienceLevels-option-2" name="multiDrop_advancedJobSearch_experienceLevels" type="checkbox" value="C" title="2-5 năm kinh nghiệm"><span>2-5 năm kinh nghiệm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_experienceLevels-option-3" title="" class=""><input id="multiDrop-advancedJobSearch_experienceLevels-option-3" name="multiDrop_advancedJobSearch_experienceLevels" type="checkbox" value="D" title="5-10 năm kinh nghiệm"><span>5-10 năm kinh nghiệm</span></label></li><li class=""><label for="multiDrop-advancedJobSearch_experienceLevels-option-4" title="" class=""><input id="multiDrop-advancedJobSearch_experienceLevels-option-4" name="multiDrop_advancedJobSearch_experienceLevels" type="checkbox" value="E" title="Hơn 10 năm kinh nghiệm"><span>Hơn 10 năm kinh nghiệm</span></label></li></div><div class="multiDropfooter"><div class="multiDropFooter clearfix reset"><a class="multiDropNone" href="#"><span>Bỏ chọn tất cả</span></a><a href="#" class="close multiDropClose">[X]</a></div></div></ul></div>
                                        </label>
                                      </p>
                                      <p class="luong clearfix" style="z-index:1">
                                        <span class="notimg">Mức lương:</span>
                                        <span>
                                          <select id="advancedJobSearch_salaryType" name="advancedJobSearch[salaryType]" onchange="changeSalary(this);"><option value="">Chọn</option><option value="I">Nhập</option><option value="M">Hơn</option><option value="N">Thương lượng</option><option value="C">Cạnh tranh</option></select>
                                          <span id="divSalaryFrom" style="display: none;">
                                            <input type="text" id="advancedJobSearch_salaryFrom" name="advancedJobSearch[salaryFrom]" size="6" value="">
                                            <select id="advancedJobSearch_salaryFromMoney" name="advancedJobSearch[salaryFromMoney]" required="required" class="moneyrate" onchange="changeMoney(this);"><option value="2">VNĐ</option><option value="1">USD</option></select>
                                          </span>
                                          <span id="divSalaryTo" style="display: none;">
                                            <input type="text" id="advancedJobSearch_salaryTo" name="advancedJobSearch[salaryTo]" size="6" value="">
                                            <select id="advancedJobSearch_salaryToMoney" name="advancedJobSearch[salaryToMoney]" required="required" class="moneyrate" onchange="changeMoney(this);"><option value="4">฿</option><option value="3">THB</option><option value="2">VNĐ</option><option value="1">USD</option></select>
                                          </span>
                                        </span>
                                      </p>
                                      <p class="clearfix searchbutton" style="z-index:0">
                                        <a href="#">Tìm kiếm</a>
                                      </p>
                                    </div>
                                  </form>
                                  <script>
                                  $(function(){
                                    $('#advancedJobSearch_categories').data('empty_label', 'Tất cả ngành nghề');
                                    $('#advancedJobSearch_provinces').data('empty_label', 'Tất cả địa điểm');
                                    $('#advancedJobSearch_educationLevels').data('empty_label', 'Tất cả');
                                    $('#advancedJobSearch_positionTypes').data('empty_label', 'Tất cả');
                                    $('#advancedJobSearch_careerLevels').data('empty_label', 'Tất cả');
                                    $('#advancedJobSearch_experienceLevels').data('empty_label', 'Tất cả');
                                  });
                                  </script>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="otherlink clearfix">
                            <div class="container">
                              <a href="/tim-viec-lam-nhanh" title="Tìm Việc Làm Nhanh">+ Tìm việc làm tuyển dụng mới</a>
                              <a href="/tim-viec-lam/nhan-vien-tong-vu/593858?create_alert=1">+ Đăng ký Thông Báo Việc Làm</a>
                              <a class="morongtimkiem" href="#">+ Mở rộng tiêu chí tìm việc làm tuyển dụng</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <?php } ?>