"use client";
import React, { useState, useEffect, useRef } from 'react';
import {User,Calendar,DollarSign,ChartSpline ,TrendingUp  } from "lucide-react"

interface RevenueByDate {
  date: number[];
  revenue: number;
}

interface DashboardData {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  revenueByDate: RevenueByDate[];
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookingCount: number;
}
interface Propsdata {
    data :DashboardData
}

type ChartType = 'bar' | 'line';

const Chart = ({data}:Propsdata) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);
  const [chartType, setChartType] = useState<ChartType>('bar');
  
const dashboardData = data

  // Group revenue by month
  const groupByMonth = (): MonthlyRevenue[] => {
    const monthMap = new Map<string, { revenue: number; count: number }>();
    
    dashboardData?.revenueByDate.forEach(item => {
      const [year, month] = item.date;
      const monthKey = `${month}/${year}`;
      
      if (monthMap.has(monthKey)) {
        const existing = monthMap.get(monthKey)!;
        monthMap.set(monthKey, {
          revenue: existing.revenue + item.revenue,
          count: existing.count + 1
        });
      } else {
        monthMap.set(monthKey, {
          revenue: item.revenue,
          count: 1
        });
      }
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookingCount: data.count
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split('/').map(Number);
        const [monthB, yearB] = b.month.split('/').map(Number);
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      });
  };

  const monthlyData = groupByMonth();

  // Format currency to VND
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format short currency
  const formatShortCurrency = (amount: number): string => {
    if (amount >= 1e9) {
      return (amount / 1e9).toFixed(1) + ' tỷ';
    } else if (amount >= 1e6) {
      return (amount / 1e6).toFixed(1) + ' triệu';
    }
    return amount?.toString();
  };

  // Prepare chart data
  const labels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']
  const revenues = new Array(12).fill(0)
  monthlyData.forEach(item => {
    const monthdetail = item.month.split('/')
   return  revenues[parseInt(monthdetail[0]) - 1] = item.revenue} )
  console.log(revenues)
  console.log(monthlyData)


//   const revenues = monthlyData.map(item => item.revenue / 1e6); // Convert to millions

  useEffect(() => {


    const loadChart = async (): Promise<void> => {
      if (chartRef.current && typeof window !== 'undefined') {
        const Chart = (await import('chart.js/auto')).default;
        const ctx = chartRef.current.getContext('2d');
        
        if (!ctx) return;
        
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: {
            labels: labels,
            datasets: [{
              label: 'Doanh thu (triệu đồng)',
              data: revenues,
              backgroundColor: 'rgba(102, 126, 234, 0.8)',
              borderColor: 'rgba(102, 126, 234, 1)',
              borderWidth: 2,
              borderRadius: chartType === 'bar' ? 8 : 0,
              tension: 0.4,
            //   fill: chartType === 'line'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context: any): string {
                    // const monthData = monthlyData[context.dataIndex];
                    const monthData = monthlyData.find(item => {
                        const months = item.month.split('/')
                      return    parseInt(months[0]) - 1 == context.dataIndex
                    })  
                    return [
                      'Doanh thu: ' + formatCurrency(context.parsed.y * 1e6),
                      'Số booking: ' + monthData?.bookingCount
                    ];
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value: string | number): string {
                    return Number(value).toFixed(0) + ' tr';
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 0
                }
              }
            }
          }
        });
      }
    };
    loadChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, monthlyData]);

  const avgRevenue = dashboardData?.totalRevenue / dashboardData?.totalBookings;
  const maxMonthRevenue = Math.max(...monthlyData.map(item => item.revenue));
  const maxMonthData = monthlyData.find(item => item.revenue === maxMonthRevenue);

  return (
    <div className="min-h-screen bg-gradient-to-brflex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
        Doanh Thu Theo Tháng 2025
        </h1>
        <p className="text-3xl font-bold mb-12 text-center ">
          Tổng quan hoạt động kinh doanh
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-5  shadow-md shadow-gray-400 text-black border-b-4 border-b-blue-500 hover:scale-105 transition-all">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-2 text-[18px] "><User/> Tổng Người Dùng</div>
            <div className="text-3xl font-bold mt-4 text-blue-500">{dashboardData?.totalUsers}</div>
          </div>
          
         <div className="rounded-xl p-5  shadow-md shadow-gray-400 text-black border-b-4 border-b-blue-500 hover:scale-105 transition-all">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-2 text-[18px]"><Calendar/> Tổng Booking</div>
            <div className="text-3xl font-bold mt-4 text-blue-500">{dashboardData?.totalBookings}</div>
          </div>
          
          <div className="rounded-xl p-5 border-b-4 border-b-blue-500 shadow-md shadow-gray-400 text-black hover:scale-105 transition-all">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-2 text-[18px]"><DollarSign/> Tổng Doanh Thu</div>
            <div className="text-2xl font-bold mt-4 text-blue-500">{formatShortCurrency(dashboardData?.totalRevenue)}</div>
          </div>
          
          <div className="rounded-xl p-5 border-b-4 border-b-blue-500 shadow-md shadow-gray-400 text-black hover:scale-105 transition-all">
            <div className="text-xs opacity-90 mb-1 flex items-center gap-2 text-[18px]"><ChartSpline/> TB/Booking</div>
            <div className="text-2xl font-bold mt-4 text-blue-500">{formatShortCurrency(avgRevenue)}</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-[18px] gap-3"><TrendingUp/> Thống kê nổi bật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl p-5 border-l-4 border-l-blue-500 shadow-md shadow-gray-400 text-black hover:translate-y-[-3px] hover:scale-105 transition-all">
              <span className="text-gray-600">Tháng có doanh thu cao nhất:</span>
              <div className="font-bold text-lg text-blue-500 mt-1">
                {formatCurrency(maxMonthRevenue)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Tháng {maxMonthData?.month} ({maxMonthData?.bookingCount} booking)
              </div>
            </div>
            <div className="rounded-xl p-5 border-l-4 border-l-blue-500 shadow-md shadow-gray-400 text-black hover:translate-y-[-3px] hover:scale-105 transition-all">
              <span className="text-gray-600">Số tháng có doanh thu:</span>
              <div className="font-bold text-lg text-blue-500 mt-1">
                {monthlyData.length} tháng
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Từ tháng {monthlyData[0]?.month}
              </div>
            </div>
          </div>
        </div>

        <div className="h-96 mb-6">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setChartType('line')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              chartType === 'line'
                ? 'bg-blue-400 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
             Biểu đồ đường
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-blue-400 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
             Biểu đồ cột
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chart;