"use client";

import React, { useState } from "react";
import { useInvoiceState } from "@/hooks/useInvoiceState";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useBillHistory } from "@/hooks/useBillHistory";
import { useComplianceChecklist } from "@/hooks/useComplianceChecklist";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/tabs/TabNavigation";
import { SellerTab } from "@/components/tabs/SellerTab";
import { BuyerTab } from "@/components/tabs/BuyerTab";
import { InvoiceTab } from "@/components/tabs/InvoiceTab";
import { ItemsTab } from "@/components/tabs/ItemsTab";
import { OtherTab } from "@/components/tabs/OtherTab";
import { ComplianceSidebar } from "@/components/sidebar/ComplianceSidebar";
import { QuickSummary } from "@/components/sidebar/QuickSummary";
import { ActionButtons } from "@/components/sidebar/ActionButtons";
import { PreviewModal } from "@/components/modals/PreviewModal";
import { TemplateGalleryModal } from "@/components/gallery/TemplateGalleryModal";
import { BillHistoryDrawer } from "@/components/history/BillHistoryDrawer";
import { FirstRunPromptModal } from "@/components/modals/FirstRunPromptModal";
import { BusinessProfileModal } from "@/components/modals/BusinessProfileModal";
import { PresetTemplatesModal } from "@/components/modals/PresetTemplatesModal";
import { GstRateSearchModal } from "@/components/modals/GstRateSearchModal";
import { ImportExportModal } from "@/components/modals/ImportExportModal";
import { exportToPdf, printInvoice } from "@/lib/pdf/export-pdf";
import { exportSingleInvoiceJson } from "@/lib/storage/json-export";
import { TEMPLATES } from "@/constants/templates";
import { StoredBill } from "@/types/storage.types";

export default function HomePage() {
  const {
    invoice,
    activeTab,
    setActiveTab,
    setCategory,
    setBillingMode,
    setTemplateId,
    updateSeller,
    updateBuyer,
    updateInvoiceMeta,
    updateOther,
    addItem,
    updateItem,
    removeItem,
    loadInvoice,
  } = useInvoiceState();

  const {
    profile,
    saveProfile,
    showFirstRunPrompt,
    dismissFirstRunPrompt,
  } = useBusinessProfile();

  const {
    bills,
    lastEvictedBill,
    clearEvictedNotice,
    saveBillToHistory,
    deleteBillFromHistory,
    clearHistory,
    refreshHistory,
  } = useBillHistory();

  const compliance = useComplianceChecklist(invoice);
  const isGstMode = invoice.billingMode === "gst";

  // Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFirstRunDismissedSession, setIsFirstRunDismissedSession] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isGstSearchOpen, setIsGstSearchOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  const isFirstRunOpen = showFirstRunPrompt && !isFirstRunDismissedSession;

  const activeTemplateMeta = TEMPLATES.find((t) => t.id === invoice.templateId);

  const handlePrint = async () => {
    // Also save to recent bills history automatically
    await saveBillToHistory(invoice);
    printInvoice();
  };

  const handleDownloadPdf = async () => {
    await saveBillToHistory(invoice);
    await exportToPdf(
      "print-invoice-root",
      `${invoice.invoice.invoiceNumber || "Invoice"}.pdf`,
      activeTemplateMeta?.paperSize || "a4"
    );
  };

  const handleSaveToHistory = async () => {
    await saveBillToHistory(invoice);
  };

  const handleSaveAsTemplate = () => {
    setIsPresetsOpen(true);
  };

  const handleExportJson = () => {
    exportSingleInvoiceJson(invoice);
  };

  const handleRefreshAllData = () => {
    refreshHistory();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Header */}
      <Header
        category={invoice.category}
        billingMode={invoice.billingMode}
        onCategoryChange={setCategory}
        onBillingModeChange={setBillingMode}
        historyCount={bills.length}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenGstSearch={() => setIsGstSearchOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tabbed Form Editor */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Form Tab Headers */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              itemCount={invoice.items.length}
            />

            {/* Tab Form Panels */}
            <div className="transition-all duration-150">
              {activeTab === "seller" && (
                <SellerTab
                  seller={invoice.seller}
                  isGstMode={isGstMode}
                  onUpdate={updateSeller}
                />
              )}

              {activeTab === "buyer" && (
                <BuyerTab
                  buyer={invoice.buyer}
                  sellerStateCode={invoice.seller.address.stateCode}
                  isGstMode={isGstMode}
                  onUpdate={updateBuyer}
                />
              )}

              {activeTab === "invoice" && (
                <InvoiceTab
                  invoice={invoice.invoice}
                  isGstMode={isGstMode}
                  onUpdate={updateInvoiceMeta}
                />
              )}

              {activeTab === "items" && (
                <ItemsTab
                  category={invoice.category}
                  items={invoice.items}
                  isGstMode={isGstMode}
                  onAddItem={addItem}
                  onUpdateItem={updateItem}
                  onRemoveItem={removeItem}
                  onOpenHsnSearch={() => setIsGstSearchOpen(true)}
                />
              )}

              {activeTab === "other" && (
                <OtherTab
                  other={invoice.other}
                  amountInWords={invoice.summary.amountInWords}
                  roundOffAmount={invoice.summary.roundOffAmount}
                  grandTotal={invoice.summary.grandTotal}
                  onUpdate={updateOther}
                />
              )}
            </div>
          </div>

          {/* Right Column: Live Compliance & Quick Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* Quick Financial Summary */}
            <QuickSummary
              summary={invoice.summary}
              isGstMode={isGstMode}
              category={invoice.category}
            />

            {/* Action Buttons: Preview, Print, Download PDF, Reset */}
            <ActionButtons
              onPreview={() => setIsPreviewOpen(true)}
              onPrint={handlePrint}
              onDownloadPdf={handleDownloadPdf}
              onSaveToHistory={handleSaveToHistory}
              onSaveAsPreset={handleSaveAsTemplate}
              onExportJson={handleExportJson}
            />

            {/* Live Statutory Rule 46 GST Compliance Checklist */}
            <ComplianceSidebar
              report={compliance}
              isGstMode={isGstMode}
            />
          </div>
        </div>
      </main>

      {/* Modals and Drawers */}
      <PreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        invoice={invoice}
        onOpenGallery={() => {
          setIsPreviewOpen(false);
          setIsGalleryOpen(true);
        }}
      />

      <TemplateGalleryModal
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        invoice={invoice}
        onSelectTemplate={setTemplateId}
      />

      <BillHistoryDrawer
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        bills={bills}
        lastEvictedBill={lastEvictedBill as StoredBill | null}
        onClearEvictedNotice={clearEvictedNotice}
        onLoadInvoice={loadInvoice}
        onDeleteBill={deleteBillFromHistory}
        onClearHistory={clearHistory}
      />

      <FirstRunPromptModal
        open={isFirstRunOpen}
        onOpenChange={(open) => {
          if (!open) setIsFirstRunDismissedSession(true);
        }}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onDismissForever={() => {
          dismissFirstRunPrompt();
          setIsFirstRunDismissedSession(true);
        }}
      />

      <BusinessProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        profile={profile}
        onSaveProfile={(newProf) => {
          saveProfile(newProf);
          updateSeller(newProf);
        }}
      />

      <PresetTemplatesModal
        open={isPresetsOpen}
        onOpenChange={setIsPresetsOpen}
        currentInvoice={invoice}
        onApplyPreset={loadInvoice}
      />

      <GstRateSearchModal
        open={isGstSearchOpen}
        onOpenChange={setIsGstSearchOpen}
      />

      <ImportExportModal
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        currentInvoice={invoice}
        onRefreshAllData={handleRefreshAllData}
      />

      {/* Mobile Navigation Bar */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        complianceScore={compliance.scorePercentage}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
