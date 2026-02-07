import os
import sys
import argparse
from ruamel.yaml import YAML

# Adjust paths
LANDSCAPE_FILE = 'landscape.yml'
LOGOS_DIR = 'hosted_logos'

def get_yaml_parser():
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.indent(mapping=2, sequence=4, offset=2)
    yaml.width = 4096
    return yaml

def load_landscape(yaml_parser):
    with open(LANDSCAPE_FILE, 'r', encoding='utf-8') as f:
        return yaml_parser.load(f)

def save_landscape(yaml_parser, data):
    with open(LANDSCAPE_FILE, 'w', encoding='utf-8') as f:
        yaml_parser.dump(data, f)

def normalize_logo_path(path):
    if path and path.startswith('./'):
        return path[2:]
    return path

def process_landscape(data, fix=False):
    referenced_logos = set()
    modified = False
    
    if 'landscape' in data:
        for category in data['landscape']:
            for subcategory in category.get('subcategories', []):
                for item in subcategory.get('items', []):
                    logo = item.get('logo')
                    if logo:
                        normalized = normalize_logo_path(logo)
                        if normalized != logo:
                            print(f"Normalizing logo: {logo} -> {normalized}")
                            if fix:
                                item['logo'] = normalized
                                modified = True
                            referenced_logos.add(normalized)
                        else:
                            referenced_logos.add(logo)
    return referenced_logos, modified

def get_hosted_logos():
    if not os.path.exists(LOGOS_DIR):
        print(f"Error: {LOGOS_DIR} dir not found")
        return set()
    return set(os.listdir(LOGOS_DIR))

def main():
    parser = argparse.ArgumentParser(description='Cleanup landscape logos')
    parser.add_argument('--fix', action='store_true', help='Apply fixes (delete orphans, update yaml)')
    args = parser.parse_args()

    print("Loading landscape...")
    yaml_parser = get_yaml_parser()
    try:
        data = load_landscape(yaml_parser)
    except FileNotFoundError:
        print(f"Error: {LANDSCAPE_FILE} not found. Please run from the repo root.")
        return

    referenced_logos, modified = process_landscape(data, fix=args.fix)
    hosted_logos = get_hosted_logos()

    print(f"Referenced logos: {len(referenced_logos)}")
    print(f"Hosted logos: {len(hosted_logos)}")

    missing_logos = referenced_logos - hosted_logos
    orphaned_logos = hosted_logos - referenced_logos

    print(f"Missing logos (referenced but not found): {len(missing_logos)}")
    for logo in missing_logos:
        print(f"  MISSING: {logo}")

    print(f"Orphaned logos (found but not referenced): {len(orphaned_logos)}")
    
    if args.fix:
        if orphaned_logos:
            print(f"Deleting {len(orphaned_logos)} orphaned logos...")
            for logo in orphaned_logos:
                path = os.path.join(LOGOS_DIR, logo)
                try:
                    os.remove(path)
                    print(f"  Deleted: {logo}")
                except OSError as e:
                    print(f"  Error deleting {logo}: {e}")
        
        if modified:
            print(f"Saving {LANDSCAPE_FILE}...")
            save_landscape(yaml_parser, data)
        else:
            print("No changes to landscape.yml needed.")
    else:
        if orphaned_logos:
             print("Run with --fix to delete orphaned logos.")
        if modified: # modified will be false if not fix, but conceptually changes are pending
             pass # logic above only modifies if fix is True. 

if __name__ == "__main__":
    main()
