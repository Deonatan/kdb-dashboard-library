const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact"
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always"
});

export const formatPrice = (value: number) => priceFormatter.format(value);

export const formatCompactNumber = (value: number) => compactNumberFormatter.format(value);

export const formatInteger = (value: number) => integerFormatter.format(value);

export const formatPercent = (value: number) => `${percentFormatter.format(value)}%`;

export const formatSignedPrice = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${priceFormatter.format(value)}`;
};
