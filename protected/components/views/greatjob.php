
<div class="box" id="newestjob">
    <h3 class="title">Việc Làm Hấp Dẫn</h3>
    <div class="listjob">
        <ul>
            <?php if ($model) {
                foreach ($model as $key => $value) {                                
             ?>
            <li>
                <?php echo CHtml::link($value->title,array('jobs/detail','id' => $value->id)); ?>                
                <?php echo CHtml::link($value->cname,array('companies/detail','id' => $value->cid),array('class' => 'top-hotjob-company-link')); ?>                                
            </li>

            <?php } } ?>            
        </ul>
    </div>
</div>