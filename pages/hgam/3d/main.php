<script src="js/jquery-3.3.1.min.js"></script>
<script>
const dir = "<?php echo $dir;?>";
const vars = <?php include $dir.'/vars.json'; ?>;
</script>
<script src="<?php echo $dir;?>/main.js"></script>

<form>
<fieldset><legend>Plot options</legend>
<input name="page" type="hidden" value="<?php echo $_GET["page"];?>">
<div id="axes">
<label>Axis 1: <select name="x1"></select></label>
<label>Axis 2: <select name="x2"></select></label>
<button type="submit">Draw</button>
</div>
<div id="cuts"></div>
<button id="add_cut" type="button">&plus; cut</button>
</fieldset>
</form>

<table id="event_table"></table>
