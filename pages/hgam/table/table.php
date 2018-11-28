<script src="js/jquery-3.3.1.min.js"></script>
<script>
const dir = "<?php echo $dir;?>";
const vars = <?php include $dir.'/vars.json'; ?>;
</script>
<script src="<?php echo $dir;?>/main.js"></script>

<form>
<fieldset><legend>Table options</legend>
<button type="submit">Show</button>
<input name="page" type="hidden" value="<?php echo $_GET["page"];?>">
<div id="vars"></div><button id="add_var" type="button">&plus; var</button>
<div id="cuts"></div><button id="add_cut" type="button">&plus; cut</button>
</fieldset>
</form>

<table id="event_table"></table>
