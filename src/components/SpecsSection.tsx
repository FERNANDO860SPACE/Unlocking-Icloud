import { useState } from "react";
import { ClipboardList, Plus, Trash2, Copy, Check, Edit2 } from "lucide-react";
import { ProductSpec } from "../types";

interface SpecsSectionProps {
  specs: ProductSpec[];
  onUpdateSpecs: (newSpecs: ProductSpec[]) => void;
}

export function SpecsSection({ specs, onUpdateSpecs }: SpecsSectionProps) {
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecVal, setNewSpecVal] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddSpec = () => {
    if (!newSpecName.trim() || !newSpecVal.trim()) return;
    onUpdateSpecs([...specs, { nome: newSpecName.trim(), valor: newSpecVal.trim() }]);
    setNewSpecName("");
    setNewSpecVal("");
  };

  const handleDeleteSpec = (index: number) => {
    onUpdateSpecs(specs.filter((_, i) => i !== index));
  };

  const handleEditSpec = (index: number, field: "nome" | "valor", value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    onUpdateSpecs(updated);
  };

  const copySpecsText = () => {
    if (specs.length === 0) return;
    const formatted = specs.map((s) => `• ${s.nome}: ${s.valor}`).join("\n");
    navigator.clipboard.writeText(`ESPECIFICAÇÕES TÉCNICAS:\n\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">📋 Especificações do Produto</h2>
        </div>

        {specs.length > 0 && (
          <button
            type="button"
            onClick={copySpecsText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Especificações Copiadas!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copiar Especificações</span>
              </>
            )}
          </button>
        )}
      </div>

      <div id="specsContent" className="specs-table">
        {specs.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center">
            <p className="empty-state text-xs text-slate-400">
              Especificações geradas após análise da imagem pela IA...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4 w-1/3">Característica / Propriedade</th>
                  <th className="py-2.5 px-4">Detalhe / Valor</th>
                  <th className="py-2.5 px-3 text-right w-20">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {specs.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    <td className="py-2.5 px-4 font-medium text-cyan-300">
                      {editingIndex === idx ? (
                        <input
                          type="text"
                          value={item.nome}
                          onChange={(e) => handleEditSpec(idx, "nome", e.target.value)}
                          className="bg-slate-900 border border-cyan-500 rounded px-2 py-1 text-xs w-full text-white"
                        />
                      ) : (
                        item.nome
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-200">
                      {editingIndex === idx ? (
                        <input
                          type="text"
                          value={item.valor}
                          onChange={(e) => handleEditSpec(idx, "valor", e.target.value)}
                          className="bg-slate-900 border border-cyan-500 rounded px-2 py-1 text-xs w-full text-white"
                        />
                      ) : (
                        item.valor
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          title={editingIndex === idx ? "Concluir edição" : "Editar"}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSpec(idx)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Excluir especificação"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add new spec inline */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          placeholder="Nova característica (ex: Voltagem)"
          value={newSpecName}
          onChange={(e) => setNewSpecName(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 flex-1"
        />
        <input
          type="text"
          placeholder="Valor (ex: Bivolt Automático 110V/220V)"
          value={newSpecVal}
          onChange={(e) => setNewSpecVal(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 flex-1"
        />
        <button
          type="button"
          onClick={handleAddSpec}
          className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar</span>
        </button>
      </div>
    </section>
  );
}
