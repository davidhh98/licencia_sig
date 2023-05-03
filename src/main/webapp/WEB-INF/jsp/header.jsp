<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="rand"
	value="<%=java.lang.Math.round(java.lang.Math.random() * 999999)%>"></c:set>
<meta name="viewport"
	content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
<style type="text/css">
        @import "./css/vendor/Dojo/dojo.css";
		@import "./css/vendor/Dojo/claro.css";
		@import "./css/vendor/Dojo/EnhancedGrid.css";
		@import "./css/vendor/Dojo/EnhancedGrid_rtl.css";
		@import "./css/vendor/jquery-ui.css";
		@import "./css/vendor/bootstrap.css";
		@import "./css/vendor/select2.css";
		@import "./css/vendor/select2.min.css";
</style>

<!-- TIPOGRAFIA -->
<script>dojoConfig = {parseOnLoad: true}</script>
<link href="./css/principal.css?v=${rand}" rel="stylesheet" type="text/css"/>

<!-- JAVASCRIPT -->
<script src="./js/vendor/jQuery/jquery-3.6.3.min.js"></script>
<script src="./js/vendor/jQuery/jquery-ui.min.js"></script>
<script src="./js/vendor/bootstrap/bootstrap.js?v=${rand}"></script>
<script src="./js/vendor/select2.min.js?p=${rand}"></script>
<script src="./js/vendor/exif.js?p=${rand}"></script>
<script src="./js/vendor/select2_es.js?p=${rand}"></script>
<script src="./js/vendor/datepicker.js?p=${rand}" charset="UTF-8"></script>
<script src="./js/vendor/Utils.js"></script>
<script src="./js/vendor/B64.js"></script>
 <script type="text/javascript"> dojo.require("dijit.Dialog"); </script>
 <script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.19.2/package/dist/xlsx.full.min.js"></script>
 
 