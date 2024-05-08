<?php
/**
 * @var \MapasCulturais\Themes\BaseV2\Theme $this
 * @var \MapasCulturais\App $app
 * 
 */

use MapasCulturais\i;

?>
<div class="progressbar">
    <span> <?= i::__('Força da senha'); ?> </span>
    <progress id="progress" :class="strongnessClass()" :value="strongness()" max="100"></progress>
    <span id="progresslabel">{{strongness()}}%</span>
</div>

<div v-if="getErrors()" class="password-rules">
    <?= i::__('A senha deve conter:') ?><br>
    <div class="password-errors" v-for="error in getErrors()">
        <div v-if="error.error" style="color:red;"><mc-icon name="close"></mc-icon> <span>{{error.message}}</span></div>
        <div v-else style="color:green;"><mc-icon name="check-no-circle"></mc-icon> <span>{{error.message}}</span></div>
    </div>
</div>