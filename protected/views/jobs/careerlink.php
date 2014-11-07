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
    <label>Số trang cần lấy (bé nhất = 2)</label>
    <input size="100" name="nums" value="2" placeholder = "0"/>
</div>
<div class="row submit">
    <?php echo CHtml::submitButton('Lấy Dữ Liệu'); ?>        
</div>

    <?php echo CHtml::endForm(); ?>
</div><!-- form -->