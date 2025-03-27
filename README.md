# Smart Tax Calculator

A comprehensive web application for calculating various taxes in the UK, Europe, and US.

## Features

- **Multiple Region Support**: Calculate taxes for the UK, European Union, and United States
- **Comprehensive Tax Coverage**:
  - Personal Direct Taxes (Income Tax, Capital Gains Tax, NICs/Social Security, Inheritance Tax)
  - Indirect Taxes (VAT/Sales Tax, Insurance Premium Tax, Excise Duties)
  - Property Taxes (Stamp Duty & Land Taxes)
  - Business Taxes (Sole Trader Income Tax, Dividend Taxes, Capital Gains on Business Sale)
  - Other Taxes (Council Tax, Vehicle Tax)

## Technologies

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Bun package manager

## Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

## Building for Production

To create a production build:

```bash
bun run build
```

The static output will be generated in the `out` directory.

## Deployment

This project is configured for deployment on Netlify. You can deploy it by:

1. Creating a new site on Netlify
2. Connecting your repository
3. Using the following build settings:
   - Build command: `bun run build`
   - Publish directory: `out`

## Project Structure

- `/src/components/tax-calculators/`: Individual tax calculator components
- `/src/lib/tax-utils.ts`: Utility functions and tax data
- `/src/components/TaxCalculator.tsx`: Main component with tabs interface

## Contributing

Feel free to submit issues or pull requests to enhance the application.

## License

MIT

## Disclaimer

This tax calculator is provided for informational purposes only and should not be considered as tax advice. Tax laws and regulations change frequently, and calculations may not reflect the most current regulations. Please consult with a qualified tax professional before making any financial decisions based on these calculations.
