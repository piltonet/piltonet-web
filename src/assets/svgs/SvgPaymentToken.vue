<template>
	<!-- Viction -->
	<div v-if="chainId == '88' || chainId == '0x58' || chainId == '89' || chainId == '0x59'"
		class="d-flex flex-column justify-content-center align-items-center"
	>
		<!-- VIC -->
		<div v-if="paymentToken == this.defaultchain.nativeCurrency.address"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<template v-if="tooltip">
				<el-tooltip :content="this.defaultchain.nativeCurrency.symbol" placement="top" :hide-after="0">
					<SvgVICIcon
						:style="`height: ${height}px;`"
						:class="customClass"
					/>
				</el-tooltip>
			</template>
			<template v-else>
				<SvgVICIcon
					:style="`height: ${height}px;`"
					:class="customClass"
				/>
			</template>
		</div>
		<!-- CUSD -->
		<div v-if="paymentToken == this.defaultchain.CUSD.address"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<template v-if="tooltip">
				<el-tooltip :content="'CUSD'" placement="top" :hide-after="0">
					<SvgCUSDIcon
						:style="`height: ${height}px;`"
						:class="customClass"
					/>
				</el-tooltip>
			</template>
			<template v-else>
				<SvgCUSDIcon
					:style="`height: ${height}px;`"
					:class="customClass"
				/>
			</template>
		</div>
		<!-- USDT -->
		<div v-if="paymentToken == 'USDT-token-address'"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<template v-if="tooltip">
				<el-tooltip :content="'Tether'" placement="top" :hide-after="0">
					<SvgUSDTIcon
						:style="`height: ${height}px;`"
						:class="customClass"
					/>
				</el-tooltip>
			</template>
			<template v-else>
				<SvgUSDTIcon
					:style="`height: ${height}px;`"
					:class="customClass"
				/>
			</template>
		</div>
		<!-- DAI -->
		<div v-if="paymentToken == 'DAI-token-address'"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<template v-if="tooltip">
				<el-tooltip :content="'DAI'" placement="top" :hide-after="0">
					<SvgDAIIcon
						:style="`height: ${height}px;`"
						:class="customClass"
					/>
				</el-tooltip>
			</template>
			<template v-else>
				<SvgDAIIcon
					:style="`height: ${height}px;`"
					:class="customClass"
				/>
			</template>
		</div>
		<!-- USD -->
		<div v-if="paymentToken == 'USD-token-address'"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<template v-if="tooltip">
				<el-tooltip :content="'USD'" placement="top" :hide-after="0">
					<SvgDollarSign
						:style="`height: ${height}px;`"
						:class="customClass"
					/>
				</el-tooltip>
			</template>
			<template v-else>
				<SvgDollarSign
					:style="`height: ${height}px;`"
					:class="customClass"
				/>
			</template>
		</div>
	</div>
	
	<!-- Undefined -->
	<div v-else>
		<el-tooltip content="Undefined Token" :placement="tooltip ? 'top' : ''" :hide-after="0">
			<div :class="customClass">
				<i class="far fa-exclamation-circle" aria-hidden="true"></i>
			</div>
		</el-tooltip>
	</div>
</template>

<script>
import { SvgVICIcon, SvgCUSDIcon, SvgUSDTIcon, SvgDAIIcon, SvgDollarSign } from "@/assets/svgs";

export default {
  name: "SvgPaymentToken",
  components: {
    SvgVICIcon,
    SvgCUSDIcon,
    SvgUSDTIcon,
		SvgDAIIcon,
		SvgDollarSign
  },
  props: {
    chainId: String,
		paymentToken: String,
		tooltip: {
			type: Boolean,
			default: true,
		},
		height: {
			type: Number,
			default: 16,
		},
    customClass: String
  }
};
</script>
