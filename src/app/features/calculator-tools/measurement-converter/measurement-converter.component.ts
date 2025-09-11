import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-measurement-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule
  ],
  template: ''
})
export class MeasurementConverterComponent implements OnInit {
  length: { fromUnit: string; toUnit: string; fromValue: number | null; result: number | null } = { fromUnit: 'meter', toUnit: 'feet', fromValue: null, result: null };
  weight: { fromUnit: string; toUnit: string; fromValue: number | null; result: number | null } = { fromUnit: 'kilogram', toUnit: 'pound', fromValue: null, result: null };
  temperature: { fromUnit: string; toUnit: string; fromValue: number | null; result: number | null } = { fromUnit: 'celsius', toUnit: 'fahrenheit', fromValue: null, result: null };
  volume: { fromUnit: string; toUnit: string; fromValue: number | null; result: number | null } = { fromUnit: 'liter', toUnit: 'gallon', fromValue: null, result: null };

  lengthUnits = [
    { key: 'millimeter', name: 'Millimeter (mm)', toMeter: 0.001 },
    { key: 'centimeter', name: 'Centimeter (cm)', toMeter: 0.01 },
    { key: 'meter', name: 'Meter (m)', toMeter: 1 },
    { key: 'kilometer', name: 'Kilometer (km)', toMeter: 1000 },
    { key: 'inch', name: 'Inch (in)', toMeter: 0.0254 },
    { key: 'feet', name: 'Feet (ft)', toMeter: 0.3048 },
    { key: 'yard', name: 'Yard (yd)', toMeter: 0.9144 },
    { key: 'mile', name: 'Mile (mi)', toMeter: 1609.34 }
  ];

  weightUnits = [
    { key: 'milligram', name: 'Milligram (mg)', toKg: 0.000001 },
    { key: 'gram', name: 'Gram (g)', toKg: 0.001 },
    { key: 'kilogram', name: 'Kilogram (kg)', toKg: 1 },
    { key: 'ounce', name: 'Ounce (oz)', toKg: 0.0283495 },
    { key: 'pound', name: 'Pound (lb)', toKg: 0.453592 },
    { key: 'stone', name: 'Stone (st)', toKg: 6.35029 },
    { key: 'ton', name: 'Ton (t)', toKg: 1000 }
  ];

  temperatureUnits = [
    { key: 'celsius', name: 'Celsius (°C)' },
    { key: 'fahrenheit', name: 'Fahrenheit (°F)' },
    { key: 'kelvin', name: 'Kelvin (K)' }
  ];

  volumeUnits = [
    { key: 'milliliter', name: 'Milliliter (ml)', toLiter: 0.001 },
    { key: 'liter', name: 'Liter (l)', toLiter: 1 },
    { key: 'gallon', name: 'Gallon (gal)', toLiter: 3.78541 },
    { key: 'quart', name: 'Quart (qt)', toLiter: 0.946353 },
    { key: 'pint', name: 'Pint (pt)', toLiter: 0.473176 },
    { key: 'cup', name: 'Cup', toLiter: 0.236588 },
    { key: 'fluid_ounce', name: 'Fluid Ounce (fl oz)', toLiter: 0.0295735 }
  ];

  quickConversions = [
    { title: '1 mile to km', description: '1 mile = 1.609 kilometers', type: 'length', from: 'mile', to: 'kilometer', value: 1 },
    { title: '1 kg to lbs', description: '1 kilogram = 2.205 pounds', type: 'weight', from: 'kilogram', to: 'pound', value: 1 },
    { title: '0°C to °F', description: '0°C = 32°F', type: 'temperature', from: 'celsius', to: 'fahrenheit', value: 0 },
    { title: '1 gallon to liters', description: '1 gallon = 3.785 liters', type: 'volume', from: 'gallon', to: 'liter', value: 1 },
    { title: '100°F to °C', description: '100°F = 37.8°C', type: 'temperature', from: 'fahrenheit', to: 'celsius', value: 100 },
    { title: '6 feet to meters', description: '6 feet = 1.829 meters', type: 'length', from: 'feet', to: 'meter', value: 6 }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Unit Converter - Convert Measurements Online | Tool Ocean',
      description: 'Free online unit converter. Convert length, weight, temperature, volume, and more between different units.',
      keywords: 'unit converter, measurement converter, length converter, weight converter, temperature converter'
    });
  }

  convertLength() {
    if (this.length.fromValue !== null && this.length.fromUnit && this.length.toUnit) {
      const fromUnit = this.lengthUnits.find(u => u.key === this.length.fromUnit);
      const toUnit = this.lengthUnits.find(u => u.key === this.length.toUnit);
      
      if (fromUnit && toUnit) {
        const meters = this.length.fromValue * fromUnit.toMeter;
        this.length.result = Math.round((meters / toUnit.toMeter) * 1000000) / 1000000;
      }
    } else {
      this.length.result = null;
    }
  }

  convertWeight() {
    if (this.weight.fromValue !== null && this.weight.fromUnit && this.weight.toUnit) {
      const fromUnit = this.weightUnits.find(u => u.key === this.weight.fromUnit);
      const toUnit = this.weightUnits.find(u => u.key === this.weight.toUnit);
      
      if (fromUnit && toUnit) {
        const kg = this.weight.fromValue * fromUnit.toKg;
        this.weight.result = Math.round((kg / toUnit.toKg) * 1000000) / 1000000;
      }
    } else {
      this.weight.result = null;
    }
  }

  convertTemperature() {
    if (this.temperature.fromValue !== null && this.temperature.fromUnit && this.temperature.toUnit) {
      let celsius: number;
      
      // Convert to Celsius first
      switch (this.temperature.fromUnit) {
        case 'celsius':
          celsius = this.temperature.fromValue;
          break;
        case 'fahrenheit':
          celsius = (this.temperature.fromValue - 32) * 5/9;
          break;
        case 'kelvin':
          celsius = this.temperature.fromValue - 273.15;
          break;
        default:
          celsius = this.temperature.fromValue;
      }
      
      // Convert from Celsius to target unit
      switch (this.temperature.toUnit) {
        case 'celsius':
          this.temperature.result = Math.round(celsius * 100) / 100;
          break;
        case 'fahrenheit':
          this.temperature.result = Math.round((celsius * 9/5 + 32) * 100) / 100;
          break;
        case 'kelvin':
          this.temperature.result = Math.round((celsius + 273.15) * 100) / 100;
          break;
        default:
          this.temperature.result = celsius;
      }
    } else {
      this.temperature.result = null;
    }
  }

  convertVolume() {
    if (this.volume.fromValue !== null && this.volume.fromUnit && this.volume.toUnit) {
      const fromUnit = this.volumeUnits.find(u => u.key === this.volume.fromUnit);
      const toUnit = this.volumeUnits.find(u => u.key === this.volume.toUnit);
      
      if (fromUnit && toUnit) {
        const liters = this.volume.fromValue * fromUnit.toLiter;
        this.volume.result = Math.round((liters / toUnit.toLiter) * 1000000) / 1000000;
      }
    } else {
      this.volume.result = null;
    }
  }

  useQuickConversion(conversion: any) {
    switch (conversion.type) {
      case 'length':
        this.length.fromUnit = conversion.from;
        this.length.toUnit = conversion.to;
        this.length.fromValue = conversion.value;
        this.convertLength();
        break;
      case 'weight':
        this.weight.fromUnit = conversion.from;
        this.weight.toUnit = conversion.to;
        this.weight.fromValue = conversion.value;
        this.convertWeight();
        break;
      case 'temperature':
        this.temperature.fromUnit = conversion.from;
        this.temperature.toUnit = conversion.to;
        this.temperature.fromValue = conversion.value;
        this.convertTemperature();
        break;
      case 'volume':
        this.volume.fromUnit = conversion.from;
        this.volume.toUnit = conversion.to;
        this.volume.fromValue = conversion.value;
        this.convertVolume();
        break;
    }
  }
}