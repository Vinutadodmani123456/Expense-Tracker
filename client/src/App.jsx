import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Sidebar } from './layouts/Sidebar.jsx';
import { WelcomeHeader } from './components/WelcomeHeader.jsx';
import { SummaryCards } from './components/SummaryCards.jsx';
import { CashflowChart } from './charts/CashflowChart.jsx';
import { CategoryDonutChart } from './charts/CategoryDonutChart.jsx';
import { SpendingTrendChart } from './charts/SpendingTrendChart.jsx';
import { MonthlyBudgetCard } from './components/MonthlyBudgetCard.jsx';
import { TransactionList } from './components/TransactionList.jsx';
import { TransactionModal } from './components/TransactionModal.jsx';
import { BudgetModal } from './components/BudgetModal.jsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import { ErrorState } from './components/EmptyState.jsx';
import { spendSphereApi } from './services/api.js';

export function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState('this_month');
  const [dbConnected, setDbConnected] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Data states
  const [summary, setSummary] = useState(null);
  const [cashflow, setCashflow] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Loading flags
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingBudget, setLoadingBudget] = useState(true);

  // Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transactionsSectionRef = useRef(null);

  // Health check
  const checkHealth = useCallback(async () => {
    try {
      const res = await spendSphereApi.getHealth();
      setDbConnected(res.data?.database?.connected ?? true);
      setGlobalError(null);
    } catch {
      setDbConnected(false);
    }
  }, []);

  // Fetch Dashboard Summaries
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res = await spendSphereApi.getSummary(period);
      setSummary(res.data.data);
      setGlobalError(null);
    } catch (err) {
      console.error('Fetch summary error:', err);
      setGlobalError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  }, [period]);

  // Fetch Charts Data
  const fetchCharts = useCallback(async () => {
    try {
      setLoadingCharts(true);
      const [cashflowRes, categoryRes] = await Promise.all([
        spendSphereApi.getCashflow(period),
        spendSphereApi.getCategories(period)
      ]);
      setCashflow(cashflowRes.data.data);
      setCategoryData(categoryRes.data.data);
    } catch (err) {
      console.error('Fetch charts error:', err);
    } finally {
      setLoadingCharts(false);
    }
  }, [period]);

  // Fetch Budget
  const fetchBudget = useCallback(async () => {
    try {
      setLoadingBudget(true);
      const res = await spendSphereApi.getBudget();
      setBudget(res.data.data);
    } catch (err) {
      console.error('Fetch budget error:', err);
    } finally {
      setLoadingBudget(false);
    }
  }, []);

  // Fetch Transactions List
  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTransactions(true);
      const res = await spendSphereApi.getTransactions({
        period,
        search: searchQuery,
        type: typeFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10
      });
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error('Fetch transactions error:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, [period, searchQuery, typeFilter, categoryFilter, sortBy, sortOrder, page]);

  // Initial and reactive loads
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    fetchSummary();
    fetchCharts();
    fetchBudget();
  }, [fetchSummary, fetchCharts, fetchBudget]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Refresh all data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      checkHealth(),
      fetchSummary(),
      fetchCharts(),
      fetchBudget(),
      fetchTransactions()
    ]);
    setIsRefreshing(false);
    toast.success('Dashboard metrics refreshed');
  };

  // Category selection from Donut Chart
  const handleCategorySelect = (category) => {
    setCategoryFilter(category || '');
    setPage(1);
    if (category) {
      toast(`Filtered transactions to: ${category}`, {
        icon: '🏷️',
        duration: 2500
      });
      if (transactionsSectionRef.current) {
        transactionsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Create or Update Transaction
  const handleSaveTransaction = async (formData) => {
    try {
      setIsSubmitting(true);
      if (transactionToEdit) {
        const id = transactionToEdit._id || transactionToEdit.id;
        await spendSphereApi.updateTransaction(id, formData);
        toast.success('Transaction updated successfully');
      } else {
        await spendSphereApi.createTransaction(formData);
        toast.success('New transaction logged');
      }

      setIsTxModalOpen(false);
      setTransactionToEdit(null);

      // Refresh all dependent financial aggregates
      fetchSummary();
      fetchCharts();
      fetchBudget();
      fetchTransactions();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Transaction
  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      setIsSubmitting(true);
      const id = transactionToDelete._id || transactionToDelete.id;
      await spendSphereApi.deleteTransaction(id);
      toast.success('Transaction deleted');

      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);

      // Refresh data
      fetchSummary();
      fetchCharts();
      fetchBudget();
      fetchTransactions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Budget
  const handleSaveBudget = async (budgetData) => {
    try {
      setIsSubmitting(true);
      await spendSphereApi.updateBudget(budgetData);
      toast.success('Monthly budget updated');
      setIsBudgetModalOpen(false);
      fetchBudget();
    } catch (err) {
      toast.error(err.message || 'Failed to update budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-xs font-semibold',
          style: {
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #1E293B'
          }
        }}
      />

      {/* Primary Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        dbConnected={dbConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 transition-all min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Welcome Header */}
          <WelcomeHeader
            period={period}
            setPeriod={(newPeriod) => {
              setPeriod(newPeriod);
              setPage(1);
            }}
            onOpenAddModal={() => {
              setTransactionToEdit(null);
              setIsTxModalOpen(true);
            }}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            setMobileOpen={setMobileOpen}
          />

          {/* Global Network or Backend Alert */}
          {globalError && (
            <ErrorState
              message={globalError}
              onRetry={handleRefresh}
            />
          )}

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Financial Summary Cards */}
              <SummaryCards summary={summary} loading={loadingSummary} />

              {/* Monthly Budget Card */}
              <MonthlyBudgetCard
                budget={budget}
                loading={loadingBudget}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />

              {/* Interactive Spending Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <CashflowChart cashflow={cashflow} loading={loadingCharts} />
                </div>
                <div className="lg:col-span-5">
                  <CategoryDonutChart
                    categoryData={categoryData}
                    loading={loadingCharts}
                    selectedCategory={categoryFilter}
                    onSelectCategory={handleCategorySelect}
                  />
                </div>
              </div>

              {/* Recent Transactions Section */}
              <div ref={transactionsSectionRef}>
                <TransactionList
                  transactions={transactions}
                  pagination={pagination}
                  loading={loadingTransactions}
                  onPageChange={(p) => setPage(p)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  typeFilter={typeFilter}
                  setTypeFilter={(t) => {
                    setTypeFilter(t);
                    setPage(1);
                  }}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={(c) => {
                    setCategoryFilter(c);
                    setPage(1);
                  }}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onEdit={(tx) => {
                    setTransactionToEdit(tx);
                    setIsTxModalOpen(true);
                  }}
                  onDeleteRequest={(tx) => {
                    setTransactionToDelete(tx);
                    setIsDeleteModalOpen(true);
                  }}
                  onAddNew={() => {
                    setTransactionToEdit(null);
                    setIsTxModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <CashflowChart cashflow={cashflow} loading={loadingCharts} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <CategoryDonutChart
                    categoryData={categoryData}
                    loading={loadingCharts}
                    selectedCategory={categoryFilter}
                    onSelectCategory={handleCategorySelect}
                  />
                </div>
                <div className="lg:col-span-6">
                  <SpendingTrendChart cashflow={cashflow} loading={loadingCharts} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="animate-fade-in">
              <TransactionList
                transactions={transactions}
                pagination={pagination}
                loading={loadingTransactions}
                onPageChange={(p) => setPage(p)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={(t) => {
                  setTypeFilter(t);
                  setPage(1);
                }}
                categoryFilter={categoryFilter}
                setCategoryFilter={(c) => {
                  setCategoryFilter(c);
                  setPage(1);
                }}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onEdit={(tx) => {
                  setTransactionToEdit(tx);
                  setIsTxModalOpen(true);
                }}
                onDeleteRequest={(tx) => {
                  setTransactionToDelete(tx);
                  setIsDeleteModalOpen(true);
                }}
                onAddNew={() => {
                  setTransactionToEdit(null);
                  setIsTxModalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <MonthlyBudgetCard
                budget={budget}
                loading={loadingBudget}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
                <h4 className="text-sm font-bold text-slate-900 mb-2">How SpendSphere Budgets Work</h4>
                <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                  <li>Your budget is anchored to the calendar month and evaluated in real-time.</li>
                  <li>When expenses cross 80% of your threshold, warning status is triggered.</li>
                  <li>When expenses exceed 100%, an alert badge is rendered with exact overrun difference.</li>
                  <li>All totals are computed directly via MongoDB server-side aggregation pipelines.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSubmit={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
        isSubmitting={isSubmitting}
      />

      {/* Budget Configuration Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleSaveBudget}
        currentBudget={budget}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete}
        isDeleting={isSubmitting}
      />
    </div>
  );
}

export default App;
