<div id="search-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide">
            <div class="holder list-job-cate city">
                <ul>
                     <?php
                    if ($model) {
                         foreach ($model as $key => $value) {                                                                              
                     ?>
                     <li><?php echo CHtml::link($value['name'],array('place/detail','id' => !empty($value['place_id']) ? $value['place_id'] : '')); ?>  <span>(<?php echo $value['count']; ?>)</span></li>                              
                    <?php } } ?>               
                </ul>
            </div>
        </div>