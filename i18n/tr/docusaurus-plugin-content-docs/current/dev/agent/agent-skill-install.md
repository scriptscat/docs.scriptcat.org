---
title: Skill'leri Kurma ve Kullanma
---

Skill, AI'ya alana özgü bilgi ve özel araçlar enjekte eden Agent için bir uzantı paketidir. Bu sayfa Skill'lerin nasıl kurulacağını, yapılandırılacağını ve yönetileceğini kapsar.

:::tip Resmi Skill deposu
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — tarayıcı otomasyonu, zamanlanmış görevler, dosya ayrıştırma, betik geliştirme yardımı ve daha fazlası için kullanıma hazır Skill'ler.
:::

## Kurulum yöntemleri

### Yöntem 1: URL'den kurma

Tarayıcınızın adres çubuğunda bir `SKILL.cat.md` URL'sini doğrudan açın; ScriptCat onu yakalar ve bir kurulum onay sayfası açar.

Örneğin, resmi tarayıcı otomasyonu Skill'ini kurmak için:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Bunu yönetim sayfasından da yapabilirsiniz:

1. ScriptCat yönetim sayfasını açın → **Agent → Skills**
2. Sağ üstteki **URL** düğmesine tıklayın
3. `SKILL.cat.md` URL'sini yapıştırın
4. Kur'a tıklayın

ScriptCat, `SKILL.cat.md` dosyasını ve bildirdiği betikleri ve referans materyal dosyalarını otomatik olarak getirir.

### Yöntem 2: ZIP kurma

1. ScriptCat yönetim sayfasını açın → **Agent → Skills**
2. Sağ üstteki **+** düğmesine tıklayın
3. `.zip` biçiminde bir Skill paketi seçin

ZIP'in dizin yapısı standart Skill biçimini izlemelidir (`SKILL.cat.md` içermelidir).

## Resmi Skill listesi

**Bağlantıyı kopyala** seçeneğine sağ tıklayın, ardından bağlantıyı Skills yönetim URL alanına yapıştırıp kurun.

| Skill | Açıklama | Kurulum |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Sayfa analizi, DOM işlemleri, form doldurma, ekran görüntüleri, gezinme | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron zamanlanmış görevler (LLM / betik geri çağrısıyla otomatik çalıştırma) | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Yeni Skill'ler oluşturmaya, test etmeye ve paketlemeye yardımcı olur | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Excel, PDF, Word, CSV ve PPT dosyalarını ayrıştırır | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey betik geliştirme asistanı | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Office elektronik tablolarını okuma/yazma | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat Resmi Hesap işlemleri asistanı | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu (RED) işlemleri asistanı | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Bir Skill'i yapılandırma

Bazı Skill'ler yapılandırma gerektirir (API anahtarı gibi):

1. **Agent → Skills** sayfasında kurulu Skill'i bulun
2. **Ayarlar** simgesine (dişli) tıklayın
3. Yapılandırma alanlarını doldurun ve kaydedin

Yapılandırmada `secret` olarak işaretlenen alanlar arayüzde maskelenir.

## Etkinleştirme / devre dışı bırakma

Skills yönetim sayfasında, bir Skill'in kartındaki anahtarı kullanarak etkin olup olmadığını kontrol edin. Devre dışı bırakılan Skill'ler sohbetlerde yüklenmez.

## Güncellemeleri kontrol etme

URL ile kurulan Skill'ler sürüm kontrolünü destekler:

1. Skills sayfasının sağ üst kısmındaki **Güncellemeleri kontrol et** düğmesine tıklayın
2. Yeni sürümü olan Skill kartları bir **Güncelle** düğmesi gösterir
3. Tek tıkla yükseltmek için ona tıklayın

Güncellemeler, `SKILL.cat.md` içinde bildirilen `version` alanı (semver biçimi) kullanılarak karşılaştırılır.

## Bir sohbette Skill kullanma

Kurulu Skill'ler Agent sohbetlerinde otomatik olarak kullanılabilir. AI, sohbet içeriğine göre bir Skill'in araçlarını ne zaman yükleyip çağıracağına karar verir.

Bir sohbet oluştururken hangi Skill'lerin yükleneceğini de belirtebilirsiniz:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Tüm Skill'leri otomatik yükle
  // veya belirli Skill'leri belirtin
  // skills: ["browser-automation", "file-parser"]
});
```

## Daha fazla bilgi

- [Skill Yönetim API'si](./agent-skill.md) — Skill'leri bir betikten programatik olarak yönetin
- [Skill Geliştirme Rehberi](./agent-skill-dev.md) — kendi Skill'inizi oluşturun
