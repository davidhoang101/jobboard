<div class="form">
    <?php echo CHtml::beginForm(); ?>

    <?php //echo CHtml::errorSummary($model); ?>
        <div class="row">
         <label><?php echo !empty($records_found) ? 'Tin đã lấy thành công' : ''; ?></label><label><?php echo $records_found; ?></label>        
     </div>

 <div class="row">
    <label>Nguồn lấy tin</label><br />
    <label>http://www.timviecnhanh.com/</label>
</div><br />
 <div class="row">
    <label>Danh Mục Lấy</label>   
    <select name="cate_id">
        <?php
            foreach ($cates as $key => $value) {                               
        ?>
        <option <?php echo (isset($_POST['cate_id']) && $_POST['cate_id']==$value->id) ? 'selected' : ''; ?> value="<?php echo $value->id ?>"><?php echo $value->name; ?></option>
      <?php
        }
      ?>    
  </select>
</div>


<div class="row">
    <label>Link tìm theo thể loại</label>
    <input size="100" name="cate_link" value="http://www.timviecnhanh.com/vieclam/tuyendung/17/cong-nghe-thong-tin.html" placeholder="http://www.timviecnhanh.com/vieclam/tuyendung/17/cong-nghe-thong-tin.html"/>
</div>
<div class="row">
    <label>Chi tiết link</label>
    <input size="100" name="cate_pattern" value="/vieclam/tuyendung/17/cong-nghe-thong-tin.html?page=" placeholder="/vieclam/tuyendung/17/cong-nghe-thong-tin.html?page=" />
</div>
<div class="row">
    <label>Từ trang số</label>
    <input size="100" name="cate_from_page" value="1" placeholder = "1" />
</div>
<div class="row">
    <label>Tới page số</label>
    <input size="100" name="cate_to_page" value="2" placeholder = "2"/>
</div>

<div class="row">
    <label>Số bản ghi (chọn 0 cho tất cả)</label>
    <input size="100" name="nums" value="5" placeholder = "0"/>
</div>
<div class="row submit">
    <?php echo CHtml::submitButton('Lưu dữ liệu'); ?>
</div>
 <!-- 
    <div class="row">
        <?php //echo CHtml::activeLabel($model,'password'); ?>
        <?php //echo CHtml::activePasswordField($model,'password') ?>
    </div>
 
    <div class="row rememberMe">
        <?php //echo CHtml::activeCheckBox($model,'rememberMe'); ?>
        <?php //echo CHtml::activeLabel($model,'rememberMe'); ?>
    </div>
 
    <div class="row submit">
        <?php echo CHtml::submitButton('Login'); ?>
    </div> -->

    <?php echo CHtml::endForm(); ?>
</div><!-- form -->