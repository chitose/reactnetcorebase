﻿${
    using System.Collections;
    using System.Text;
    using IO = System.IO;
    using Typewriter.Extensions.Types;

    Template(Settings settings)
    {
        settings.OutputFilenameFactory = file => CamelCase(IO.Path.GetFileNameWithoutExtension(file.Name));
    }

    static bool IsIgnoreProperty(Property property) {
        return property.Attributes.Any(a => a.Name == "JsonIgnore");
    }

    static bool IsOptionalProperty(Property property) {
        return property.Attributes.Any(a => a.Name == "OptionalTypeScriptProperty");
    }

  static string CamelCase(string s)
    {
        if (string.IsNullOrEmpty(s)) return s;
        if (char.IsUpper(s[0]) == false) return s;
        var chars = s.ToCharArray();
        chars[0] = char.ToLowerInvariant(chars[0]);
        return new string(chars);
    }    

    IEnumerable <Property> InheritedProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                yield return p;
            @class = @class.BaseClass;
        }
    }    

    IEnumerable <Property> InheritedRequiredProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (!IsIgnoreProperty(p) && !IsOptionalProperty(p))
                yield return p;
            @class = @class.BaseClass;
        }
    }

    IEnumerable <Property> InheritedOptionalProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (!IsIgnoreProperty(p) && IsOptionalProperty(p))
                yield return p;
            @class = @class.BaseClass;
        }
    }

    string Validations(Property p)
  {
    var sb = new StringBuilder();
    int count = 0;
    foreach (var a in p.Attributes)
    {
      Func<string, string> validation;
      if (!validations.TryGetValue(a.Name, out validation)) continue;
      if (count++ > 0) sb.Append(", ");
      sb.Append(validation(a.Value));
    }
    if (count > 1) sb.Insert(0, "[").Append("]");
    return sb.ToString();
  }

    static readonly SortedDictionary<string, Func<string, string>> validations = new SortedDictionary<string, Func<string, string>>
  {
    { "Required", v => "Constraints.required()" },
    { "MaxLength", v => "Constraints.maxLength("+v+")"},
    { "MinLength", v => "Constraints.minLength("+v+")" },
    {"MatchValidation", v=> "Constraints.match('"+CamelCase(v)+"')"},
    { "EmailAddress", v => "Constraints.email()" },
    { "NullableEmailValidation", v => "Constraints.email()" },
    {"Password", v=> "Constraints.password()"}
  };

  IEnumerable <Property> ValidableProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (p.Attributes.Any(a => validations.ContainsKey(a.Name)))
                yield return p;
            @class = @class.BaseClass;
        }
    }

  private bool Visited(Type type, Dictionary < string, Type > set)
    {
        if (type.IsDefined && !set.ContainsKey(type.FullName)) {
            set.Add(type.FullName, type);
            return true;
        }
        return false;
    }

  private void VisitTypes(Class @class, Dictionary < string, Type > set)
    {
        foreach(var p in InheritedProperties(@class))
        {
            var t = p.Type.Unwrap();
            Visited(t, set);
        }
    }    

  static Dictionary <File, IEnumerable <Type>> DependenciesCache = new Dictionary<File, IEnumerable<Type>>();

    IEnumerable < Type > Dependencies(File file)
    {
        IEnumerable < Type > result;
        if (DependenciesCache.TryGetValue(file, out result)) return result;

        var set = new Dictionary<string, Type>();
        foreach(var @class in file.Classes)
        VisitTypes(@class, set);
        result = set.Values;

        DependenciesCache.Add(file, result);
        return result;
    }

    bool HasEnumDependencies(File file) => Dependencies(file).Any(x => x.IsEnum);
    bool HasValidatables(File file) => file.Classes.Any(c => ValidableProperties(c).Any());
    IEnumerable <Type> EnumDependencies(File file) => Dependencies(file).Where(t => t.IsEnum);
    bool HasValidatables(Class @class) => ValidableProperties(@class).Any();
    IEnumerable <Type> ClassDependencies(File file) => Dependencies(file).Where(t => !t.IsEnum && t.name!="t");    

    string GetTypeString(Type @type) {        
        var rtype = @type.Name;
        if (@type.Name == "number[]")
            rtype = "string";
        if (@type.IsNullable || @type.name == "string"){
          return rtype + " | null";
        }
        return rtype;
  }
}// Auto-generated using typewriter -> from model.tst
$HasEnumDependencies[import { $EnumDependencies[$Name][, ] } from '../enums';]
$HasValidatables[import { Constraints } from '../../service/validator';]
$ClassDependencies[import { $Name } from './$name';]
$Classes(ReactNetCoreBase.Models.View.*)[export class $Name$IsGeneric[<T>] {
$InheritedRequiredProperties[  $name: $Type[$GetTypeString];
]$InheritedOptionalProperties[  $name?: $Type[$GetTypeString];
]
$HasValidatables[
    static ValidationRules = {
$ValidableProperties[       $name: $Validations][,
]
    };]

    static ColumnNames = {
$InheritedProperties[       $name : '$name',
]   };
}]