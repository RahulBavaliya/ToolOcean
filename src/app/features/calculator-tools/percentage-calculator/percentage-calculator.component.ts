import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">percent</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Percentage Calculator
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate percentages, percentage increase/decrease, and percentage of a number. 
            Perfect for business, finance, and everyday calculations.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <mat-card class="p-6">
            <mat-tab-group>
              <!-- Basic Percentage -->
              <mat-tab label="Basic Percentage">
                <div class="py-6">
                  <h3 class="text-lg font-semibold mb-4">What is X% of Y?</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <mat-form-field>
                      <mat-label>Percentage (%)</mat-label>
                      <input matInput type="number" [(ngModel)]="basic.percentage" (input)="calculateBasic()" placeholder="25">
                    </mat-form-field>
                    
                    <mat-form-field>
                      <mat-label>Of Number</mat-label>
                      <input matInput type="number" [(ngModel)]="basic.number" (input)="calculateBasic()" placeholder="200">
                    </mat-form-field>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div class="text-sm text-purple-600">Result</div>
                      <div class="text-2xl font-bold text-purple-800">{{ basic.result }}</div>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-600" *ngIf="basic.result !== null">
                    <strong>Calculation:</strong> {{ basic.percentage }}% of {{ basic.number }} = {{ basic.result }}
                  </div>
                </div>
              </mat-tab>

              <!-- Percentage Change -->
              <mat-tab label="Percentage Change">
                <div class="py-6">
                  <h3 class="text-lg font-semibold mb-4">Percentage Increase/Decrease</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <mat-form-field>
                      <mat-label>Original Value</mat-label>
                      <input matInput type="number" [(ngModel)]="change.original" (input)="calculateChange()" placeholder="100">
                    </mat-form-field>
                    
                    <mat-form-field>
                      <mat-label>New Value</mat-label>
                      <input matInput type="number" [(ngModel)]="change.new" (input)="calculateChange()" placeholder="120">
                    </mat-form-field>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div class="text-sm text-purple-600">Percentage Change</div>
                      <div class="text-2xl font-bold" 
     [class.text-green-600]="change.result !== null && change.result > 0" 
     [class.text-red-600]="change.result !== null && change.result < 0" 
                     [class.text-purple-800]="change.result !== null && change.result === 0">
  {{ (change.result !== null && change.result > 0) ? '+' : '' }}{{ change.result }}%
</div>


                    </div>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" *ngIf="change.result !== null">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="text-sm text-gray-600">Absolute Change</div>
                      <div class="text-lg font-semibold">{{ change.absolute }}</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="text-sm text-gray-600">Change Type</div>
                      <div class="text-lg font-semibold" [class.text-green-600]="change.result !== null && change.result > 0" [class.text-red-600]="change.result !== null && change.result < 0">
                        {{ getChangeType() }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-600" *ngIf="change.result !== null">
                    <strong>Calculation:</strong> {{ change.original }} to {{ change.new }} = {{ change.result }}% {{ getChangeDirection() }}
                  </div>
                </div>
              </mat-tab>

              <!-- Find the Whole -->
              <mat-tab label="Find the Whole">
                <div class="py-6">
                  <h3 class="text-lg font-semibold mb-4">X is Y% of what number?</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <mat-form-field>
                      <mat-label>Number</mat-label>
                      <input matInput type="number" [(ngModel)]="whole.part" (input)="calculateWhole()" placeholder="50">
                    </mat-form-field>
                    
                    <mat-form-field>
                      <mat-label>Is what % of</mat-label>
                      <input matInput type="number" [(ngModel)]="whole.percentage" (input)="calculateWhole()" placeholder="25">
                    </mat-form-field>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div class="text-sm text-purple-600">The Whole Number</div>
                      <div class="text-2xl font-bold text-purple-800">{{ whole.result }}</div>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-600" *ngIf="whole.result !== null">
                    <strong>Calculation:</strong> {{ whole.part }} is {{ whole.percentage }}% of {{ whole.result }}
                  </div>
                </div>
              </mat-tab>

              <!-- Find the Percentage -->
              <mat-tab label="Find the Percentage">
                <div class="py-6">
                  <h3 class="text-lg font-semibold mb-4">X is what percent of Y?</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <mat-form-field>
                      <mat-label>Number</mat-label>
                      <input matInput type="number" [(ngModel)]="percent.part" (input)="calculatePercent()" placeholder="25">
                    </mat-form-field>
                    
                    <mat-form-field>
                      <mat-label>Of Total</mat-label>
                      <input matInput type="number" [(ngModel)]="percent.total" (input)="calculatePercent()" placeholder="100">
                    </mat-form-field>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div class="text-sm text-purple-600">Percentage</div>
                      <div class="text-2xl font-bold text-purple-800">{{ percent.result }}%</div>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-600" *ngIf="percent.result !== null">
                    <strong>Calculation:</strong> {{ percent.part }} is {{ percent.result }}% of {{ percent.total }}
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card>

          <!-- Quick Examples -->
          <mat-card class="mt-8 p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">lightbulb</mat-icon>
                Common Percentage Calculations
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let example of examples" class="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors" (click)="useExample(example)">
                <h4 class="font-semibold text-gray-800 mb-2">{{ example.title }}</h4>
                <p class="text-sm text-gray-600 mb-2">{{ example.description }}</p>
                <div class="text-xs text-purple-600 font-medium">{{ example.calculation }}</div>
              </div>
            </div>
          </mat-card>

          <!-- Percentage Tips -->
          <mat-card class="mt-8 p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-green-500">tips_and_updates</mat-icon>
                Percentage Tips & Formulas
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Basic Formulas</h3>
                <div class="space-y-2 text-sm">
                  <div class="bg-gray-50 p-3 rounded">
                    <strong>Percentage:</strong> (Part / Whole) × 100
                  </div>
                  <div class="bg-gray-50 p-3 rounded">
                    <strong>Part:</strong> (Percentage / 100) × Whole
                  </div>
                  <div class="bg-gray-50 p-3 rounded">
                    <strong>Whole:</strong> Part / (Percentage / 100)
                  </div>
                  <div class="bg-gray-50 p-3 rounded">
                    <strong>Change:</strong> ((New - Old) / Old) × 100
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Quick Mental Math</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div>• 10% = Move decimal point left once</div>
                  <div>• 1% = Move decimal point left twice</div>
                  <div>• 50% = Divide by 2</div>
                  <div>• 25% = Divide by 4</div>
                  <div>• 20% = Divide by 5</div>
                  <div>• 15% = 10% + 5% (half of 10%)</div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class PercentageCalculatorComponent implements OnInit {
  basic: { percentage: number | null; number: number | null; result: number | null } = { percentage: null, number: null, result: null };
change: { original: number | null; new: number | null; result: number | null; absolute: number | null } = { original: null, new: null, result: null, absolute: null };
whole: { part: number | null; percentage: number | null; result: number | null } = { part: null, percentage: null, result: null };
percent: { part: number | null; total: number | null; result: number | null } = { part: null, total: null, result: null };


  examples = [
    {
      title: 'Sales Tax',
      description: 'Calculate 8.5% tax on $150',
      calculation: '8.5% of $150 = $12.75',
      type: 'basic',
      values: { percentage: 8.5, number: 150 }
    },
    {
      title: 'Tip Calculation',
      description: 'Calculate 18% tip on $85',
      calculation: '18% of $85 = $15.30',
      type: 'basic',
      values: { percentage: 18, number: 85 }
    },
    {
      title: 'Discount',
      description: 'Calculate 25% off $200',
      calculation: '25% of $200 = $50 off',
      type: 'basic',
      values: { percentage: 25, number: 200 }
    },
    {
      title: 'Grade Score',
      description: '85 out of 100 points',
      calculation: '85 is 85% of 100',
      type: 'percent',
      values: { part: 85, total: 100 }
    },
    {
      title: 'Price Increase',
      description: 'Price went from $50 to $65',
      calculation: '30% increase',
      type: 'change',
      values: { original: 50, new: 65 }
    },
    {
      title: 'Population Growth',
      description: 'Population grew from 1000 to 1200',
      calculation: '20% increase',
      type: 'change',
      values: { original: 1000, new: 1200 }
    }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Percentage Calculator - Calculate Percentages Online | Tool Ocean',
      description: 'Free online percentage calculator. Calculate percentages, percentage increase/decrease, and percentage of a number.',
      keywords: 'percentage calculator, calculate percentage, percentage increase, percentage decrease, percentage change'
    });
  }

  calculateBasic() {
    if (this.basic.percentage !== null && this.basic.number !== null) {
      this.basic.result = Math.round((this.basic.percentage * this.basic.number / 100) * 100) / 100;
    } else {
      this.basic.result = null;
    }
  }

  calculateChange() {
    if (this.change.original !== null && this.change.new !== null && this.change.original !== 0) {
      this.change.absolute = this.change.new - this.change.original;
      this.change.result = Math.round(((this.change.new - this.change.original) / this.change.original * 100) * 100) / 100;
    } else {
      this.change.result = null;
      this.change.absolute = null;
    }
  }

  calculateWhole() {
    if (this.whole.part !== null && this.whole.percentage !== null && this.whole.percentage !== 0) {
      this.whole.result = Math.round((this.whole.part / (this.whole.percentage / 100)) * 100) / 100;
    } else {
      this.whole.result = null;
    }
  }

  calculatePercent() {
    if (this.percent.part !== null && this.percent.total !== null && this.percent.total !== 0) {
      this.percent.result = Math.round((this.percent.part / this.percent.total * 100) * 100) / 100;
    } else {
      this.percent.result = null;
    }
  }

  getChangeType(): string {
    if (this.change.result === null) return 'No Change';
    if (this.change.result > 0) return 'Increase';
    if (this.change.result < 0) return 'Decrease';
    return 'No Change';
  }

  getChangeDirection(): string {
    if (this.change.result === null) return '';
    return this.change.result >= 0 ? 'increase' : 'decrease';
  }

  useExample(example: any) {
    switch (example.type) {
      case 'basic':
        this.basic.percentage = example.values.percentage;
        this.basic.number = example.values.number;
        this.calculateBasic();
        break;
      case 'change':
        this.change.original = example.values.original;
        this.change.new = example.values.new;
        this.calculateChange();
        break;
      case 'whole':
        this.whole.part = example.values.part;
        this.whole.percentage = example.values.percentage;
        this.calculateWhole();
        break;
      case 'percent':
        this.percent.part = example.values.part;
        this.percent.total = example.values.total;
        this.calculatePercent();
        break;
    }
  }
}