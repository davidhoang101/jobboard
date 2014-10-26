<div class="form">
    <?php echo CHtml::beginForm(); ?>

    <?php //echo CHtml::errorSummary($model); ?>
    <div class="row">
     <label><?php echo !empty($records_found) ? 'Tin đã lấy thành công' : ''; ?></label><label><?php echo $records_found; ?></label>        
 </div>

 <div class="row">
    <label>Nguồn lấy tin</label><br />
    <label>http://www.careerlink.vn/</label>
</div><br />

 <div class="row">
    <label>Category Name</label>   
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
    <label>Category Link</label>
    <input size="100" name="cate_link" value="http://www.careerlink.vn/viec-lam/cntt-phan-mem19" placeholder="http://www.careerlink.vn/viec-lam/cntt-phan-mem19"/>
</div>
<div class="row">
    <label>Category Pattern</label>
    <input size="100" name="cate_pattern" value="/viec-lam/cntt-phan-mem/19?page=" placeholder="/viec-lam/cntt-phan-mem/19?page=" />
</div>
<div class="row">
    <label>From page</label>
    <input size="100" name="cate_from_page" value="1" placeholder = "1" />
</div>
<div class="row">
    <label>To page</label>
    <input size="100" name="cate_to_page" value="1" placeholder = "3"/>
</div>

<div class="row">
    <label>Number of record (type 0 for select all)</label>
    <input size="100" name="nums" value="1" placeholder = "0"/>
</div>
<div class="row submit">
    <?php echo CHtml::submitButton('Lưu Dữ Liệu'); ?>        
</div>

    <?php echo CHtml::endForm(); ?>
</div><!-- form -->